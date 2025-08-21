// src/app/services/data-processor.service.ts

import { Injectable } from '@angular/core';
import { ChartSeries } from '../../../core/models/model';
import { IStatistics } from '../model/SeriesData';
import { LabelProcessorService } from './label-processor.service';
import { StatisticsCalculatorService } from './statistics-calculator.service';
export interface ProcessedData {
  conclusion: IStatistics[];
  chartData: any[];
  uniqueLabels: string[];
}
@Injectable({
  providedIn: 'root',
})
export class DataProcessorService {
  conclusion: IStatistics[] = [];

  constructor(
    private statisticsCalculator: StatisticsCalculatorService,
    private labelProcessor: LabelProcessorService
  ) {}

  processData(seriesData: ChartSeries[], reportType: string): ProcessedData {
    this.conclusion = [];

    const uniqueBuildings = [
      ...new Set(
        seriesData.map((item) =>
          item.AssetName === '' || null ? 'test' : item.AssetName
        )
      ),
    ];
    const uniqueLabels = this.labelProcessor.getUniqueLabels(
      seriesData,
      reportType
    );
    const assetValues = seriesData.map((item) => item.Value);

    if (assetValues.length > 0) {
      const totalStats = this.statisticsCalculator.calculateStatistics(
        assetValues,
        'Total'
      );
      this.conclusion.push(totalStats);

      uniqueBuildings.forEach((building) => {
        const buildingValues = seriesData
          .filter((item) => item.AssetName === building)
          .map((item) => item.Value);
        const buildingStats = this.statisticsCalculator.calculateStatistics(
          buildingValues,
          building
        );
        this.conclusion.push(buildingStats);
      });
      if (reportType === 'MonthlyPeakDemand') {
        const chartData = this.initializeSeriesDatawithdate(
          uniqueBuildings,
          uniqueLabels,
          seriesData,
          reportType
        );
        return { conclusion: this.conclusion, chartData, uniqueLabels };
      } else {
        const chartData = this.initializeSeriesData(
          uniqueBuildings,
          uniqueLabels,
          seriesData,
          reportType
        );
        return { conclusion: this.conclusion, chartData, uniqueLabels };
      }
      //return { conclusion: this.conclusion, chartData, uniqueLabels };
    } else {
      console.log('The seriesData array is empty.');
      return { conclusion: this.conclusion, chartData: [], uniqueLabels: [] };
    }
  }

  private initializeSeriesDatawithdate(
    uniqueBuildings: string[],
    uniqueLabels: string[],
    seriesData: ChartSeries[],
    reportType: string
  ) {
    const seriesDataArray = uniqueBuildings.map((building) => ({
      name: building,
      data: Array(uniqueLabels.length).fill(0),
      Date: Array(uniqueLabels.length).fill(''), // Initialize Date with empty strings
    }));

    seriesData.forEach((item) => {
      let labelIndex: number;
      switch (reportType) {
        case 'Hourly':
          labelIndex = uniqueLabels.indexOf(
            this.labelProcessor.convertTo12HourFormat(item.GetHour)
          );
          break;
        case 'Daily':
          labelIndex = uniqueLabels.indexOf(
            `${item.Day}/${item.DateMonth}/${item.GetYear}`
          );
          break;
        case 'Monthly':
        case 'MonthlyGhG':
        case 'MonthlyTrend':
        case 'MonthlyCo2':
        case 'MonthlyPeakDemand':
        case 'MonthlyAgainstBudget':
          labelIndex = uniqueLabels.indexOf(
            `${item.DateMonth}/${item.GetYear}`
          );
          break;
        case 'DailyCo2':
          labelIndex = uniqueLabels.indexOf(
            `${item.Day}/${item.DateMonth}/${item.GetYear}`
          );
          break;
        case 'Yearly':
        case 'YearlyAgainstBudget':
          labelIndex = uniqueLabels.indexOf(item.GetYear.toString());
          break;
        default:
          labelIndex = -1;
      }

      const buildingIndex = uniqueBuildings.indexOf(item.AssetName);
      if (labelIndex !== -1 && buildingIndex !== -1) {
        seriesDataArray[buildingIndex].data[labelIndex] += item.Value;

        // Store the date in the required format
        seriesDataArray[buildingIndex].Date[
          labelIndex
        ] = `${item.Day}/${item.DateMonth}/${item.GetYear}`;
      }
    });

    return seriesDataArray;
  }

  private initializeSeriesData(
    uniqueBuildings: string[],
    uniqueLabels: string[],
    seriesData: ChartSeries[],
    reportType: string
  ) {
    const seriesDataArray = uniqueBuildings.map((building) => ({
      name: building,
      data: Array(uniqueLabels.length).fill(0),
      Date: Array(uniqueLabels.length).fill(0),
    }));

    seriesData.forEach((item) => {
      let labelIndex: number;
      switch (reportType) {
        case 'Hourly':
          labelIndex = uniqueLabels.indexOf(
            this.labelProcessor.convertTo12HourFormat(item.GetHour)
          );
          break;
        case 'Daily':
          labelIndex = uniqueLabels.indexOf(
            `${item.Day}/${item.DateMonth}/${item.GetYear}`
          );
          break;
        case 'Monthly':
          labelIndex = uniqueLabels.indexOf(
            `${item.DateMonth}/${item.GetYear}`
          );
          break;
        case 'MonthlyGhG':
          labelIndex = uniqueLabels.indexOf(
            `${item.DateMonth}/${item.GetYear}`
          );
          break;
        case 'MonthlyTrend':
          labelIndex = uniqueLabels.indexOf(
            `${item.DateMonth}/${item.GetYear}`
          );
          break;
        case 'DailyCo2':
          labelIndex = uniqueLabels.indexOf(
            `${item.Day}/${item.DateMonth}/${item.GetYear}`
          );
          break;
        case 'MonthlyCo2':
          labelIndex = uniqueLabels.indexOf(
            `${item.DateMonth}/${item.GetYear}`
          );
          break;
        case 'MonthlyPeakDemand':
          labelIndex = uniqueLabels.indexOf(
            `${item.DateMonth}/${item.GetYear}`
          );
          break;
        case 'MonthlyAgainstBudget':
          labelIndex = uniqueLabels.indexOf(
            `${item.DateMonth}/${item.GetYear}`
          );
          break;
        case 'Yearly':
        case 'YearlyAgainstBudget':
          labelIndex = uniqueLabels.indexOf(item.GetYear.toString());
          break;
        default:
          labelIndex = -1;
      }

      const buildingIndex = uniqueBuildings.indexOf(item.AssetName);
      if (labelIndex !== -1 && buildingIndex !== -1) {
        seriesDataArray[buildingIndex].data[labelIndex] += item.Value;
      }
    });

    return seriesDataArray;
  }
}
