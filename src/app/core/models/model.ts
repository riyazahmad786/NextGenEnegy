export interface ChartData {
  Value: number;
  DateMonth: number;
  MonthName: string;
  Day: number;
  GetYear: number;
  Unit: string;
  Name: string;
}

export interface ChartSeries {
  AssetID: number;
  AssetName: string;
  Value: number;
  DateMonth: number;
  MonthName: string;
  Day: number;
  GetYear: number;
  GetHour: number;
  Unit: string;
  LocationName: string;
  Buildingid: number;
  TargetBudget: number;
  BudgetPercent: number;
  value: number;
}

export interface SummaryLocation {
  AssetID: number;
  AssetName: string;
  Value: number;
  flag: boolean;
}

export interface Summary {
  Name: string;
  value: number;
  flag: boolean;
}

export interface Total {
  TotalSum: number;
}

export interface TableData {
  [key: string]: { [key: string]: string | undefined };
}

export interface TableEntry {
  Month: number;
  BuildingName: string;
  SumTotalValue: number;
  Unit: string;
  TargetLine: number;
  MonthName: string;
}

export interface SummaryEntry {
  BuildingName: string;
  Value: number;
  TargetBudget: number;
  BudgetPercent: number;
}

export interface IZUserDisplaySettings {
  LogoUrl: string;
  Title: string;
  Portal: string;
  LoginUrl: string;
}
