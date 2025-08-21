// File: SeriesData.ts

export interface IDataItem {
  AssetName: string;
  GetHour: string;
  Value: number;
}

export interface IStatistics {
  title: string;
  totalValue: number;
  minValue: number;
  maxValue: number;
  averageValue: number;
}
enum ReportType {
  Hourly = 'Hourly',
  Daily = 'Daily',
  Monthly = 'Monthly',
  Yearly = 'Yearly',
}

export interface EmailReport {
  Email: string;
  Attachment: string;
  Subject: string;
}
