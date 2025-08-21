import { Injectable } from '@angular/core';
import * as Highcharts from 'highcharts';
import {
  DataProcessorService,
  ProcessedData,
} from '../../services/data-processor.service';
import { ExportService } from '../chart-export/export.service';

import Exporting from 'highcharts/modules/exporting';

Exporting(Highcharts);
@Injectable({
  providedIn: 'root',
})
export class ColumnChartService {
  constructor(
    private dataProcessor: DataProcessorService,
    private exportService: ExportService
  ) {}

  Highcharts: typeof Highcharts = Highcharts;
  chart?: Highcharts.Chart;
  chartOptions!: Highcharts.Options;

  getChartOptions(
    seriesData: any,
    filterType: string,
    chartType: string,
    reportFullName: string,
    unitType: string,
    maxLine: number
  ) {
    //const encodedUnitType = unitType.replace('ft²', 'sq.ft');
    const processedData: ProcessedData = this.dataProcessor.processData(
      seriesData,
      filterType
    );
    this.chartOptions = {
      exporting: {
        enabled: false,
        fallbackToExportServer: false, // Ensure offline export
      },
      chart: { type: chartType, height: 300, width: 1400 },
      title: { text: `${reportFullName}` },
      xAxis: { categories: processedData.uniqueLabels, crosshair: true },
      yAxis: this.configureYAxis(maxLine ?? 0, unitType),
      credits: {
        enabled: false,
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat:
          '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y:.1f} ' +
          unitType +
          '</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true,
      },
      plotOptions: {
        column: { pointPadding: 0.2, borderWidth: 0 },
      },
      series: processedData.chartData as Highcharts.SeriesOptionsType[],
    };
    return this.chartOptions;
  }
  async exportChart(chartOptions: Highcharts.Options): Promise<string> {
    try {
      return await this.exportChartAsBase64(chartOptions);
    } catch (error) {
      throw new Error('Error exporting chart: ' + error);
    }
  }

  private exportChartAsBase64(
    chartOptions: Highcharts.Options
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const chart = Highcharts.chart(
        document.createElement('div'),
        chartOptions
      ) as Highcharts.Chart & { getSVG: () => string };

      const svg = chart.getSVG();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.src = 'data:image/svg+xml;base64,' + btoa(svg);

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };

      img.onerror = (error) => reject(error);
    });
  }

  configureYAxis(maxLine: number, yAxisTitle: string) {
    if (maxLine === 0) {
      return {
        min: 0,
        title: { text: yAxisTitle },
      };
    } else {
      return {
        max: maxLine,
        min: 0,
        title: { text: yAxisTitle },
        plotLines: [{ value: maxLine, width: 1, color: '#ff0000' }],
      };
    }
  }

  // async exportChart(chartOptions: any): Promise<string> {
  //   const exportOptions = {
  //     infile: JSON.stringify(chartOptions),
  //   };
  //   try {
  //       const blob = await this.exportService
  //         .exportChart(exportOptions)
  //         .toPromise();
  //       const base64String = await this.convertBlobToBase64(blob!);
  //     return base64String;
  //   } catch (error) {
  //     throw new Error('Error exporting chart: ' + error);
  //   }
  // }
  // private async convertBlobToBase64(blob: Blob): Promise<string> {
  //   return new Promise<string>((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(blob);
  //     reader.onloadend = () => {
  //       const base64String = reader.result as string;
  //       resolve(base64String);
  //     };
  //     reader.onerror = (error) => {
  //       reject(new Error('FileReader error: ' + error));
  //     };
  //   });
  // }
}
