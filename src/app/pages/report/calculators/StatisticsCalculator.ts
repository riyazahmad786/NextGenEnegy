// File: StatisticsCalculator.ts

export interface IStatistics {
  title: string;
  totalValue: number;
  minValue: number;
  maxValue: number;
  averageValue: number;
}

export class StatisticsCalculator {
  static calculateStatistics(values: number[], title: string): IStatistics {
    if (values.length === 0) {
      throw new Error('Values array is empty.');
    }
    const totalValue = values.reduce((acc, curr) => acc + curr, 0);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const averageValue = totalValue / values.length;
    return { title, totalValue, minValue, maxValue, averageValue };
  }
}
