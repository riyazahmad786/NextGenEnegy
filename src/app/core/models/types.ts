export type AssetType =
  | 'Water Consumption'
  | 'Electricity Consumption'
  | 'Gas Consumption'
  | 'Sustainability Report'
  | 'Trend and Intensity Report'
  | 'Electricity Expenses'
  | 'Peak Demand'
  | 'Weather Energy Consumption';
export type ReportType =
  | 'Hourly'
  | 'Daily'
  | 'MonthlyTrend'
  | 'Monthly'
  | 'MonthlyPeakDemand'
  | 'MonthlyAgainstBudget'
  | 'YearlyAgainstBudget'
  | 'Yearly';

export type UnitType = 'kWh' | 'Therms' | 'Liter' | 'kg/kWh' | 'kWh/Sq-ft';
