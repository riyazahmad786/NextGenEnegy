import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DashboardStateService {
  constructor() {}
  electricityData = {
    consumption: signal<any[]>([]),
    expansion: signal<any[]>([]),
    chartData: signal<any[]>([]),
    lastMonthUnit: signal<any[]>([]),
    totalMonthUnit: signal<any[]>([]),
    summaryExpansion: signal<any[]>([]),
    summaryConsumption: signal<any[]>([]),
  };

  // Global state
  dashboardState = {
    facilityId: signal<number | undefined>(undefined),
    locationId: signal<number | undefined>(undefined),
    userId: signal<number | undefined>(undefined),
    locations: signal<any[]>([]),
    selectedIndex: signal<number | undefined>(undefined),
    name: signal<string>(''),
    nameExpanses: signal<string>(''),
    tooltip: signal<string>(''),
    tooltipTitle: signal<string>(''),
    totalConsumption: signal<number>(0),
    isConsumptionShow: signal<boolean>(false),
    isConsumptionAndExpansionShow: signal<boolean>(false),
    isConsumptionHave: signal<boolean>(false),
    isExpansionHave: signal<boolean>(false),
    headerTitle: signal<string>(''),
    chartType: signal<string>(''),
  };

  // Utility method for resetting state if necessary
  resetState() {
    this.dashboardState.totalConsumption.set(0);
    this.electricityData.consumption.set([]);
    this.dashboardState.isConsumptionShow.set(false);
    this.dashboardState.isConsumptionHave.set(false);
  }
}
