// chart.service.ts
import { Injectable } from '@angular/core';
import { ChartSeries } from '../../../../core/models/model';
import { ColumnChartService } from './column-chart.service';

@Injectable({
  providedIn: 'root',
})
export class ChartService {
  constructor(private columnChart: ColumnChartService) {}

  getChartOptions(
    data: ChartSeries[],
    reportType: string,
    chartType: string,
    reportFullName: string,
    unitType: string,
    maxLine: number
  ) {
    return this.columnChart.getChartOptions(
      data,
      reportType,
      chartType,
      reportFullName,
      unitType,
      maxLine
    );
  }

  exportChart(template: any) {
    return this.columnChart.exportChart(template);
  }
}
