export enum ReportType {
  ElectricityConsumption = 'Electricity Consumption',
  ElectricityExpenses = 'Electricity Expenses',
  GasConsumption = 'Gas Consumption',
  GasExpenses = 'Gas Expenses',
  WaterConsumption = 'Water Consumption',
  WaterExpenses = 'Water Expenses',
  SustainabilityReport = 'Sustainability Report',
  TrendAndIntensityReport = 'Trend and Intensity Report',
  MonthlyTrend = 'Trend',
  MonthlyIntensity = 'Intensity',
  PeakDemand = 'Peak Demand',
  WeatherConsumption = 'Weather Adjusted Energy Consumption',
}

export enum TooltipLabel {
  ElectricityTotalConsumption = 'Total Consumption kWh',
  GasTotalConsumption = 'Total Consumption Therms',
  WaterTotalConsumption = 'Total Consumption Liter',
  MonthlyTrend = 'Trend',
  MonthlyIntensity = 'Intensity',
  PeakDemand = 'Peak Demand',
}

export enum Unit {
  kWh = 'kWh',
  Therms = 'Therms',
  Liters = 'Liters',
  kwhFit = 'kWh/Sq-ft',
}

export enum ConsumptionType {
  Consumption = 'consumption',
  Expansion = 'expansion',
}

export enum AppState {
  LocationId = 'locationId',
  LocationName = 'locationName',
  LocationData = 'locationData',
  UserId = 'userId',
  FacilityId = 'facilityId',
  FacilityName = 'facilityName',
  ReportType = 'reportType',
  ActionType = 'actionType',
  AdminFacilityID = 'adminFacilityID',
  AdminFacilityName = 'adminFacilityName',
  FTimezone = 'FTimezone',
  AdminLocationID = 'adminLocationID',
  ParentLocationID = 'ParentLocationID',
  AdminFloorId = 'adminFloorId',
}
