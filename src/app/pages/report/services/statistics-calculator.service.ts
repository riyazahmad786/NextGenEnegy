// src/app/services/statistics-calculator.service.ts

import { Injectable } from '@angular/core';
import { IStatistics } from '../model/SeriesData';

@Injectable({
  providedIn: 'root',
})
export class StatisticsCalculatorService {
  calculateStatistics(values: number[], title: string): IStatistics {
    const totalValue = values.reduce((acc, curr) => acc + curr, 0);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const averageValue = totalValue / values.length;
    return { title, totalValue, minValue, maxValue, averageValue };
  }
}
