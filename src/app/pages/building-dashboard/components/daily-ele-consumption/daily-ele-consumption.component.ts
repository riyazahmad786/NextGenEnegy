import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { Observable, Subscription } from 'rxjs';
import { AssetType } from '../../../../core/models/types';
import { AppState } from '../../../../core/utils/report-types-utils';
import { PointFormatTypePipe } from '../../../../shared/pipes/PointFormatType.pipe';
import { AppStateService } from '../../../../shared/service/app-state.service';
import { ActionService } from '../../services/action.service';
import { BuildingDashboardService } from '../../services/building-dashboard.service';
@Component({
  selector: 'app-daily-ele-consumption',
  standalone: true,
  imports: [HighchartsChartModule],
  //templateUrl: './daily-ele-consumption.component.html',
  template: `
    <div id="chart-container">
      <highcharts-chart
        [Highcharts]="Highcharts"
        [options]="chartOptions"
        style="width: 100%; height: 400px; display: block;"
      >
      </highcharts-chart>
    </div>
  `,

  styleUrl: './daily-ele-consumption.component.css',
})
export class DailyEleConsumptionComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;
  chart?: Highcharts.Chart;
  chartOptions!: Highcharts.Options;
  facilityId?: number;
  locationId?: number;
  userId?: number;

  chartData: any[] = [];
  chartLabels: string[] = [];
  loading: boolean = false;
  error: string = '';

  private actionChangedSubscription!: Subscription;

  constructor(
    private buildingService: BuildingDashboardService,
    private appState: AppStateService,
    private actionService: ActionService
  ) {}
  ngOnInit() {
    this.initializeParametersAndFetchData();
    this.subscribeToActionChanges();
  }
  private pointFormatTypePipe = new PointFormatTypePipe();

  private initializeParametersAndFetchData(): void {
    this.userId = this.appState.getParameter(AppState.UserId)!;
    this.facilityId = this.appState.getParameter(AppState.FacilityId)!;
    this.locationId = this.appState.getParameter(AppState.LocationId)!;
    const actionType = this.appState.getParameter(AppState.ActionType);
    this.fetchChartData(
      actionType,
      this.facilityId!,
      this.userId!,
      this.locationId!
    );
  }

  private subscribeToActionChanges(): void {
    this.actionChangedSubscription = this.actionService.reload$.subscribe(
      (params: any) => {
        this.initializeParametersAndFetchData();
      }
    );
  }

  fetchChartData(
    assetType: AssetType,
    facilityId: number,
    userId: number,
    locationId: number
  ): void {
    facilityId = this.appState.getParameter(AppState.FacilityId)!;
    const serviceMethod = this.getServiceMethod(
      assetType,
      facilityId,
      userId,
      locationId
    );

    serviceMethod.subscribe(
      (data: any[]) => {
        this.processChartData((data as any).Table, assetType); // Assuming data is already parsed correctly
      },
      (error) => {
        console.error('Error fetching data:', error);
        this.error = 'Failed to fetch data';
      }
    );
  }

  private getServiceMethod(
    assetType: AssetType,
    facilityId: number,
    userId: number,
    locationId: number
  ): Observable<any> {
    const serviceMethodMap: { [key in AssetType]: () => Observable<any> } = {
      'Electricity Consumption': () =>
        this.buildingService.GetDailyElectricityConsumption(
          facilityId,
          userId,
          locationId
        ),
      'Gas Consumption': () =>
        this.buildingService.GetDailyGasConsumption(
          facilityId,
          userId,
          locationId
        ),
      'Water Consumption': () =>
        this.buildingService.GetDailyWaterConsumption(
          facilityId,
          userId,
          locationId
        ),
      'Sustainability Report': () =>
        this.buildingService.GetSustainabilityGHGEmission(
          facilityId,
          userId,
          locationId
        ),
      'Trend and Intensity Report': () =>
        this.buildingService.GetDailyIntensityReport(
          facilityId,
          userId,
          locationId
        ),
      'Peak Demand': () =>
        this.buildingService.GetMonthlyPeekDemand(
          facilityId,
          userId,
          locationId
        ),
      'Electricity Expenses': () =>
        this.buildingService.GetElectricityExpenses(
          facilityId,
          userId,
          locationId
        ),
      'Weather Energy Consumption': function (): Observable<any> {
        throw new Error('Function not implemented.');
      },
    };

    return serviceMethodMap[assetType]
      ? serviceMethodMap[assetType]()
      : serviceMethodMap['Electricity Consumption']();
  }

  processChartData(data: any[], reportType: string): void {
    if (reportType === 'Weather Adjusted Energy Consumption') {
      // Display only the "Coming Soon" message without rendering chart
      const comingSoonMessage = `
        <div style="text-align: center; padding: 20px; font-size: 1.5em; color: #555;">
          <strong style="font-size: 1.5em; color: #333;">Coming Soon!</strong>
          <p style="margin-top: 10px;">
            We are working on bringing this feature to you soon. Stay tuned!
          </p>
        </div>
      `;
      this.loadChartData(comingSoonMessage, 'Coming Soon!', null); // Pass null to avoid rendering chart
      return;
    }

    // Continue with regular chart rendering logic
    const groupedData = this.groupDataByAssetName(data);
    this.chartData = this.createChartData(groupedData);

    if (this.chartData.length > 0) {
      this.chartLabels =
        reportType === 'Peak Demand'
          ? this.createChartLabels(groupedData)
          : this.createChartLabel(groupedData);
      const unitName = this.getUnit(data);
      const chartType = this.determineChartType(reportType);
      const formattedReportType = this.formatReportType(reportType);

      this.loadChartData(formattedReportType, unitName, chartType);
    } else {
      this.loadChartData('No data available', 'No data available');
    }
  }

  createChartLabel(groupedData: Record<string, any[]>): string[] {
    const firstAssetData = groupedData[Object.keys(groupedData)[0]];
    return firstAssetData.map((item) =>
      this.formatChartLabelS(item.Day, item.DateMonth, item.GetYear)
    );
  }

  private formatChartLabelS(day: any, month: number, year: any): string {
    if (day == '0') {
      return `${month}/${year}`;
    }
    return `${day}/${month}/${year}`;
  }
  createChartLabels(groupedData: Record<string, any[]>): string[] {
    const firstAssetData = groupedData[Object.keys(groupedData)[0]];
    // For monthly peak demand, format labels as month/year:
    return firstAssetData.map(
      (item) => this.formatChartLabel(undefined, item.DateMonth, item.GetYear) // No 'Day' for monthly
    );
  }

  private formatChartLabel(day: any, month: number, year: any): string {
    return `${month}/${year}`; // Format as month/year for monthly peak demand
  }
  private determineChartType(reportType: string): string {
    return reportType === 'Peak Demand' ? 'scatter' : 'column';
  }

  private formatReportType(reportType: string): string {
    const reportTypeMappings: { [key: string]: string } = {
      'Sustainability Report': 'DailyCo2 Sustainability Report',
      'Trend and Intensity Report': 'Daily Intensity Report',
      'Electricity Expenses': 'Monthly Electricity Expenses',
      'Peak Demand': 'Monthly Peak Demand',
    };

    return reportTypeMappings[reportType] || `Daily ${reportType}`;
  }

  getUnit(groupedData: any): string {
    const unitValue = groupedData[0].Unit;
    return unitValue;
  }

  groupDataByAssetName(data: any[]): any {
    return data.reduce((acc, curr) => {
      const assetName = curr.AssetName;
      if (!acc[assetName]) {
        acc[assetName] = [];
      }
      acc[assetName].push(curr);
      return acc;
    }, {});
  }
  // Swati Changes
  createChartData(groupedData: Record<string, any[]>): any[] {
    return Object.entries(groupedData).map(([assetName, dataForAsset]) => {
      const dataValues = dataForAsset.map((item) => {
        const fullDate = new Date(
          item.GetYear,
          item.DateMonth - 1,
          item.Day == '0' ? 1 : Number(item.Day)
        );
        //  const formattedDate = `${fullDate.getMonth() + 1}/${fullDate.getDate()}/${fullDate.getFullYear()}`; // Format as MM/DD/YYYY
        const formattedDate = `${fullDate.getDate()}/${
          fullDate.getMonth() + 1
        }/${fullDate.getFullYear()}`; // Format as MM/DD/YYYY

        return {
          y: item.Value, // Value for the chart
          date: formattedDate, // Store formatted date
          fullDate: fullDate, // Keep full date object for other uses
        };
      });
      return {
        name: assetName === 'undefined' ? '' : assetName,
        data: dataValues,
      };
    });
  }
  loadChartData(
    chartTitle: string,
    unitName: string,
    chartType: string | null = 'column'
  ): void {
    const chartContainer = document.getElementById('chart-container');

    if (!chartType) {
      // Only show the message and skip chart rendering
      if (chartContainer) {
        chartContainer.innerHTML = chartTitle;
      } else {
        console.warn('Chart container not found in the DOM.');
      }
      return;
    }

    // Proceed with chart rendering if chartType is provided
    this.chartOptions = this.buildChartOptions(chartTitle, unitName, chartType);

    if (this.chart) {
      this.chart.destroy();
    }

    if (chartContainer) {
      this.chart = Highcharts.chart(chartContainer, this.chartOptions);
    } else {
      console.warn('Chart container not found in the DOM.');
    }
  }

  private buildChartOptions(
    chartTitle: string,
    unitName: string,
    chartType: string
  ): Highcharts.Options {
    return {
      chart: {
        type: chartType,
      },
      title: {
        text: chartTitle,
      },
      subtitle: {
        text: '',
      },

      xAxis: this.buildXAxisOptions(),
      yAxis: this.buildYAxisOptions(unitName),
      tooltip: this.buildTooltipOptions(unitName),
      plotOptions: this.buildPlotOptions(),
      series: this.chartData as Highcharts.SeriesOptionsType[],
    };
  }

  private buildXAxisOptions(): Highcharts.XAxisOptions {
    return {
      categories: this.chartLabels,
      crosshair: true,
      lineWidth: 1,
      lineColor: '#979797',
      labels: {
        style: {
          fontSize: '10px',
          color: '#5a5a5a',
        },
      },
    };
  }

  private buildYAxisOptions(unitName: string): Highcharts.YAxisOptions {
    return {
      min: 0,
      title: {
        text: unitName,
      },
    };
  }
  //Swati Changes
  private buildTooltipOptions(unitName: string): Highcharts.TooltipOptions {
    const pointType = this.pointFormatTypePipe.transform(unitName);
    return {
      headerFormat: '<span style="font-size:10px"></span><table>',
      pointFormat:
        `<tr><td style="color:{series.color};padding:0"> {series.name}: </td>` +
        `<td style="padding:0"><b>{${pointType}} ${unitName}</b></td></tr>` +
        `<tr><td style="color:{series.color};padding:0"> Date: </td>` +
        `<td style="padding:0"><b>{point.date}</b></td></tr>`, // Add formatted date here
      footerFormat: '</table>',
      shared: true,
      useHTML: true,
    };
  }

  private buildPlotOptions(): Highcharts.PlotOptions {
    return {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
      },
    };
  }

  ngOnDestroy(): void {
    this.unsubscribeFromActionChanges();
  }

  private unsubscribeFromActionChanges(): void {
    if (this.actionChangedSubscription) {
      this.actionChangedSubscription.unsubscribe();
    }
  }
}
