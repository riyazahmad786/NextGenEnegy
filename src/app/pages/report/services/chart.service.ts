import { Injectable } from '@angular/core';
import Highcharts from 'highcharts';
import { ProcessedData } from './data-processor.service';

@Injectable({
  providedIn: 'root',
})
export class ChartService {
  createChart(
    container: string,
    options: Highcharts.Options
  ): Highcharts.Chart {
    return Highcharts.chart(container, options);
  }

  updateChart(chart: Highcharts.Chart, options: Highcharts.Options): void {
    chart.update(options);
  }

  destroyChart(chart: Highcharts.Chart): void {
    chart.destroy();
  }

  generateChartOptions(
    processedData: ProcessedData,
    title: string,
    type: string,
    tooltipTitle: string,
    yAxisTitle: string,
    maxLine?: number,
    pointType: string = 'point.y:.0f'
  ): Highcharts.Options {
    return {
      chart: { type },
      title: { text: title },
      xAxis: { categories: processedData.uniqueLabels, crosshair: true },
      yAxis: this.configureYAxis(maxLine ?? 0, yAxisTitle),
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat:
          `<tr><td style="color:{series.color};padding:0">{series.name}: </td>` +
          `<td style="padding:0"><b>{${pointType}} ${tooltipTitle}</b></td></tr>`,
        footerFormat: '</table>',
        shared: true,
        useHTML: true,
      },
      plotOptions: {
        column: { pointPadding: 0.2, borderWidth: 0 },
      },
      series: processedData.chartData as Highcharts.SeriesOptionsType[],
    };
  }
  generateChartOptionsdatePeak(
    processedData: ProcessedData,
    title: string,
    type: string,
    tooltipTitle: string,
    yAxisTitle: string,
    maxLine?: number
  ): Highcharts.Options {
    const dateArrays = processedData.chartData.map((series) => series.Date);

    const chartSeriesWithData = processedData.chartData.map((series) => ({
      name: series.name,
      data: series.data,
    }));

    return {
      chart: { type },
      title: { text: title },
      xAxis: { categories: processedData.uniqueLabels, crosshair: true },
      yAxis: this.configureYAxis(maxLine ?? 0, yAxisTitle),
      tooltip: {
        headerFormat: ' ',
        pointFormatter: function () {
          const seriesIndex = this.series.index;
          const pointIndex = this.index;
          const date = dateArrays[seriesIndex][pointIndex];
          return `<table>
                <tr>
                    <td style="color: ${this.series.color}; font-weight: bold;">${this.series.name}: </td>
                    <td style="padding-left: 10px;"><b>${this.y} ${tooltipTitle}</b></td>
                </tr>
                <tr>
                    <td colspan="2"><b>Date:  &nbsp &nbsp &nbsp </b> ${date}</td>
                </tr>
            </table>`;
        },
        footerFormat: '</table>',
        shared: true,
        useHTML: true,
      },
      plotOptions: {
        column: { pointPadding: 0.2, borderWidth: 0 },
      },
      series: chartSeriesWithData as Highcharts.SeriesOptionsType[],
    };
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
}
