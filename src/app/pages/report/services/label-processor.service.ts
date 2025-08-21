// src/app/services/label-processor.service.ts

import { Injectable } from '@angular/core';
import { ChartSeries } from '../../../core/models/model';

@Injectable({
  providedIn: 'root',
})
export class LabelProcessorService {
  getUniqueLabels(seriesData: ChartSeries[], reportType: string): string[] {
    let uniqueLabels: string[];

    switch (reportType) {
      case 'Hourly':
        uniqueLabels = [...new Set(seriesData.map((item) => item.GetHour))].map(
          (hour) => this.convertTo12HourFormat(hour)
        );
        break;
      case 'Daily':
        uniqueLabels = [
          ...new Set(
            seriesData.map(
              (item) => `${item.Day}/${item.DateMonth}/${item.GetYear}`
            )
          ),
        ];
        break;
      case 'Monthly':
        uniqueLabels = [
          ...new Set(
            seriesData.map((item) => `${item.DateMonth}/${item.GetYear}`)
          ),
        ];
        break;
      case 'MonthlyTrend':
        uniqueLabels = [
          ...new Set(
            seriesData.map((item) => `${item.DateMonth}/${item.GetYear}`)
          ),
        ];
        break;
      case 'MonthlyAgainstBudget':
        uniqueLabels = [
          ...new Set(
            seriesData.map((item) => `${item.DateMonth}/${item.GetYear}`)
          ),
        ];
        break;
      case 'MonthlyGhG':
        uniqueLabels = [
          ...new Set(
            seriesData.map((item) => `${item.DateMonth}/${item.GetYear}`)
          ),
        ];
        break;
      case 'DailyCo2':
        uniqueLabels = [
          ...new Set(
            seriesData.map(
              (item) => `${item.Day}/${item.DateMonth}/${item.GetYear}`
            )
          ),
        ];
        break;
      case 'MonthlyCo2':
        uniqueLabels = [
          ...new Set(
            seriesData.map((item) => `${item.DateMonth}/${item.GetYear}`)
          ),
        ];
        break;
      case 'MonthlyPeakDemand':
        uniqueLabels = [
          ...new Set(
            seriesData.map((item) => `${item.DateMonth}/${item.GetYear}`)
          ),
        ];
        break;
      case 'Yearly':
      case 'YearlyAgainstBudget':
        uniqueLabels = [
          ...new Set(seriesData.map((item) => item.GetYear.toString())),
        ];
        break;
      default:
        uniqueLabels = [];
    }

    return uniqueLabels;
  }

  convertTo12HourFormat(hour: number): string {
    const h = hour % 24;
    const ampm = h >= 12 ? 'PM' : 'AM';
    const formattedHour = h % 12 || 12;
    return `${formattedHour} ${ampm}`;
  }
}
