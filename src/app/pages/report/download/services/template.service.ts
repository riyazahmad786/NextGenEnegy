import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize, lastValueFrom } from 'rxjs';
import { ImageUploadEventService } from '../../../../../../src/app/pages/setting/components/upload-image/service/image-upload-event.service';
import { ChartSeries } from '../../../../core/models/model';
import { SpinnerService } from '../../../../core/services/spinner.service';
import { RoundingService } from '../../../../core/utils/rounding.service';
import { ToastService } from '../../../../shared/service/toast.service';
import { ReportProcessor } from '../../helper/report-processor';
import {
  DataProcessorService,
  ProcessedData,
} from '../../services/data-processor.service';
import { ReportService } from '../../services/report.service';
import { ChartService } from './chart.service';
import { HtmlService } from './html.service';
import { PdfService } from './pdf.service';
//const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root',
})
export class TemplateService {
  constructor(
    private readonly http: HttpClient,
    private readonly chartService: ChartService,
    private readonly htmlService: HtmlService,
    private readonly dataProcessor: DataProcessorService,
    private readonly pdfService: PdfService,
    private readonly reportService: ReportService,
    private toastService: ToastService,
    private spinnerService: SpinnerService,
    private roundingService: RoundingService,
    private imageUploadEventService: ImageUploadEventService
  ) {}

  async downloadHtmlFile(
    data: ChartSeries[],
    TableBudgetData: ChartSeries[],
    reportType: string,
    facility: string,
    location: string,
    endDate: string,
    reportFullName: string,
    startDate: string,
    chartType: string,
    unitType: string,
    floorName: string,
    username: string,
    maxLine: number,
    FTimezone: string
    // fileName: string
  ) {
    this.spinnerService.show();
    const dateType = this.getDateType(startDate, endDate);
    chartType =
      reportFullName === 'Monthly Trend Report'
        ? 'line'
        : reportFullName === 'Monthly Peak Demand'
        ? 'scatter'
        : chartType;
    if (reportFullName === 'Monthly Trend Report') {
      chartType = 'line';
    }
    if (
      reportType !== 'MonthlyAgainstBudget' &&
      reportType !== 'YearlyAgainstBudget'
    ) {
      data = TableBudgetData; // Set TableBudgetData to data
    }
    const role = username;
    try {
      const logoResult = await this.imageUploadEventService
        .getImageUrl(role)
        .toPromise();

      const finalLogoUrl = await this.safeConvertImageToBase64(
        logoResult?.imageUrl || 'assets/vendors/images/deskapp-logo.png'
      );
      //console.log('check this logo ', finalLogoUrl);
      const template = this.chartService.getChartOptions(
        data,
        reportType,
        chartType,
        chartType === 'line' ? floorName || reportFullName : reportFullName,
        //chartType == 'line' ? floorName : reportFullName,
        unitType,
        maxLine
      );

      let tableHtml = '';
      if (
        reportType === 'MonthlyAgainstBudget' ||
        reportType === 'YearlyAgainstBudget'
      ) {
        tableHtml = this.htmlService.GenerateAgainstBudgetHtml(
          TableBudgetData,
          new ReportProcessor(
            TableBudgetData,
            reportType,
            this.roundingService
          ),

          username,
          unitType,
          startDate, // Pass start date
          endDate, // Pass end date
          FTimezone
        );
      } else {
        tableHtml = this.htmlService.generateHtml(
          data,
          unitType,
          new ReportProcessor(data, reportType, this.roundingService),
          username,
          FTimezone
        );
      }

      const probityTotal = this.htmlService.generateComparisonHtml(
        this.getProcessedConclusion(data, reportType),
        reportFullName,
        reportType,
        unitType
      );
      const templateJson = await this.chartService.exportChart(template);

      this.http
        .get('assets/templates/location-report.html', {
          responseType: 'text',
        })
        .subscribe(async (htmlContents: string) => {
          let htmlContent = htmlContents;
          htmlContent = this.replacePlaceholders(htmlContent, {
            FacilityHtml: facility,
            locationHtml: location,
            filterHtml: reportFullName,
            DateTypeHtml: dateType,
            ChartImage: templateJson,
            tableRecords: tableHtml,
            probityTotal: probityTotal,
            CompanyLogoUrl: finalLogoUrl,
          });
          try {
            const fileName = template.title?.text || 'document'; // Default to 'document' if title is undefined
            await this.pdfService.generatePdf(htmlContent, `${fileName}.pdf`);

            // await this.pdfService.generatePdf(htmlContent);
          } catch (error) {
            console.error('Error fetching data:', error);
          } finally {
            this.spinnerService.hide();
          }
        });
    } catch (error) {
      console.error('Error fetching data:', error);
      this.toastService.showToast({
        text: 'Failed to download report.',
        type: 'danger',
      });
    } finally {
      this.spinnerService.hide();
    }
  }
  private async safeConvertImageToBase64(url: string): Promise<string> {
    // If already base64, return as-is
    if (url.startsWith('data:')) return url;

    try {
      // Clean the URL by removing query parameters and fixing double slashes
      let cleanUrl = url.split('?')[0]; // Remove query parameters
      cleanUrl = cleanUrl.replace(/([^:]\/)\/+/g, '$1'); // Fix double slashes

      // Check if this is a local asset (already in assets folder)
      if (cleanUrl.includes('assets/')) {
        return await this.convertLocalAssetToBase64(cleanUrl);
      }
      if (cleanUrl.includes('localhost:51411')) {
        return await this.convertBackendImageToBase64(cleanUrl);
      }
      // if (!cleanUrl.startsWith('http') && environment.baseUrl) {
      //   cleanUrl = `${environment.baseUrl}${
      //     cleanUrl.startsWith('/') ? '' : '/'
      //   }${cleanUrl}`;
      // }

      return await this.convertBackendImageToBase64(cleanUrl);
    } catch (error) {
      console.error('Image conversion error:', error);
      return this.getFallbackLogo();
    }
  }

  private async convertBackendImageToBase64(url: string): Promise<string> {
    try {
      // Extract just the filename from the URL
      const filename = url.substring(url.lastIndexOf('/') + 1);
      const proxyUrl = `/Files/${filename}`;
      // Use environment.baseUrl for production
      // const apiUrl = environment.baseUrl;
      // const imageUrl = `${apiUrl}/Files/${filename}`;
      const response = await lastValueFrom(
        this.http.get(proxyUrl, {
          responseType: 'blob',
          headers: {
            Accept: 'image/*',
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache',
          },
        })
      );

      return await this.blobToBase64(response);
    } catch (error) {
      console.error('Failed to convert backend image:', error);
      throw error;
    }
  }

  private async convertLocalAssetToBase64(assetPath: string): Promise<string> {
    try {
      // Remove leading slash if present
      const cleanPath = assetPath.startsWith('/')
        ? assetPath.substring(1)
        : assetPath;

      const response = await lastValueFrom(
        this.http.get(cleanPath, { responseType: 'blob' })
      );

      return await this.blobToBase64(response);
    } catch (error) {
      console.error('Failed to convert local asset:', error);
      throw error;
    }
  }

  // Update blobToBase64 to be type-safe
  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert blob to base64'));
        }
      };
      reader.onerror = () => reject(new Error('FileReader error'));
      reader.readAsDataURL(blob);
    });
  }

  private getAbsoluteUrl(relativeUrl: string): string {
    // Remove leading slash if present to avoid double slashes
    const cleanUrl = relativeUrl.startsWith('/')
      ? relativeUrl.substring(1)
      : relativeUrl;

    return `${window.location.origin}/${cleanUrl}`;
  }

  /**
   * Gets fallback logo as base64
   */
  private async getFallbackLogo(): Promise<string> {
    try {
      const response = await this.http
        .get('assets/vendors/images/deskapp-logo.png', { responseType: 'blob' })
        .toPromise();

      if (!response) {
        throw new Error('Empty fallback response');
      }

      return await this.blobToBase64(response);
    } catch (error) {
      console.error('Failed to load fallback logo:', error);
      // Return a transparent pixel as last resort
      return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
    }
  }

  async generateEmailReport(
    email: string,
    chartSeries: ChartSeries[],
    TableBudgetData: ChartSeries[],
    reportType: string,
    facilityName: string,
    locationName: string,
    endDate: string,
    reportName: string,
    startDate: string,
    chartType: string,
    unitType: string,
    floorName: string,
    username: string,
    maxLine: number,
    FTimezone: string
  ) {
    this.spinnerService.show();
    const dateRange = this.getDateType(startDate, endDate);
    chartType =
      reportName === 'Monthly Trend Report'
        ? 'line'
        : reportName === 'Monthly Peak Demand'
        ? 'scatter'
        : chartType;
    if (reportName === 'Monthly Trend Report') {
      chartType = 'line';
    }
    if (
      reportType !== 'MonthlyAgainstBudget' &&
      reportType !== 'YearlyAgainstBudget'
    ) {
      chartSeries = TableBudgetData; // Set TableBudgetData to data
    }
    const role = username;
    try {
      const logoResult = await this.imageUploadEventService
        .getImageUrl(role)
        .toPromise();

      const finalLogoUrl = await this.safeConvertImageToBase64(
        logoResult?.imageUrl || 'assets/vendors/images/deskapp-logo.png'
      );
      const chartOptions = this.chartService.getChartOptions(
        chartSeries,
        reportType,
        chartType,
        //chartType == 'line' ? floorName : reportName,
        reportName,
        unitType,
        maxLine
      );
      let tableHtml = '';
      if (
        reportType === 'MonthlyAgainstBudget' ||
        reportType === 'YearlyAgainstBudget'
      ) {
        tableHtml = this.htmlService.GenerateAgainstBudgetHtml(
          TableBudgetData,
          new ReportProcessor(
            TableBudgetData,
            reportType,
            this.roundingService
          ),
          username,
          unitType,
          startDate, // Pass start date
          endDate, // Pass end date
          FTimezone
        );
      } else {
        tableHtml = this.htmlService.generateHtml(
          chartSeries,
          unitType,
          new ReportProcessor(chartSeries, reportType, this.roundingService),
          username,
          FTimezone
        );
      }

      const conclusionHtml = this.htmlService.generateComparisonHtml(
        this.getProcessedConclusion(chartSeries, reportType),
        reportName,
        reportType,
        unitType
      );
      const chartImage = await this.chartService.exportChart(chartOptions);

      this.http
        .get('assets/templates/location-report.html', { responseType: 'text' })
        .subscribe(
          async (templateContent: string) => {
            const populatedTemplate = this.replacePlaceholders(
              templateContent,
              {
                FacilityHtml: facilityName,
                locationHtml: locationName,
                filterHtml: reportName,
                DateTypeHtml: dateRange,
                ChartImage: chartImage,
                tableRecords: tableHtml,
                probityTotal: conclusionHtml,

                CompanyLogoUrl: finalLogoUrl,
              }
            );
            try {
              const base64Report = await this.pdfService.generateBase64Image(
                populatedTemplate
              );
              this.sendEmailReport(base64Report, reportType, email);
            } catch (error) {
              console.error('Error fetching data:', error);
            } finally {
              this.spinnerService.hide();
            }
          },
          (error) => {
            console.error('Error fetching data:', error);
            this.spinnerService.hide();
          }
        );
    } catch (error) {
      console.error('Error fetching data:', error);
      this.toastService.showToast({
        text: 'Failed to download report.',
        type: 'danger',
      });
    } finally {
      this.spinnerService.hide();
    }
  }

  /**
   * Sends an email report with the given report data, report type, and email address.
   * @param reportData The base64 encoded report data.
   * @param reportType The type of report.
   * @param email The email address to send the report to.
   * @returns void
   */

  sendEmailReport(reportData: string, reportType: string, email: string): void {
    this.spinnerService.show();
    const emailReport: { Email: string; Attachment: string; Subject: string } =
      {
        Email: email,
        Attachment: reportData,
        Subject: reportType,
      };

    this.reportService
      .sendReportEmail(emailReport)
      .pipe(
        finalize(() => this.spinnerService.hide()) // Hide spinner in both success and error cases
      )
      .subscribe(
        (response: { success: boolean }) => {
          if (response.success) {
            this.toastService.showToast({
              text: 'Report sent successfully!',
              type: 'success',
            });
          } else {
            this.toastService.showToast({
              text: 'Failed to send report.',
              type: 'danger',
            });
          }
        },
        (error: Error) => {
          this.toastService.showToast({
            text: 'Failed to send report.',
            type: 'danger',
          });
        }
      );
  }

  private getDateType(startDate: string, endDate: string): string {
    return endDate
      ? `<strong>From: ${startDate} To ${endDate}</strong>`
      : `<strong>Date: ${startDate}</strong>`;
  }

  private replacePlaceholders(
    htmlContent: string,
    replacements: { [key: string]: string }
  ): string {
    for (const key in replacements) {
      htmlContent = htmlContent.replace(
        new RegExp(key, 'g'),
        replacements[key]
      );
    }
    return htmlContent;
  }

  private getProcessedConclusion(
    data: ChartSeries[],
    reportType: string
  ): ProcessedData['conclusion'] {
    return this.dataProcessor.processData(data, reportType).conclusion;
  }
}
