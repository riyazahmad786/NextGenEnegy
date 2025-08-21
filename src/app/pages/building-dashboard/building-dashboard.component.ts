import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { getCountryCode } from 'countries-list';
import { Observable, Subscription } from 'rxjs';
import { Summary } from '../../core/models/model';
import { DashboardStateService } from '../../core/services/dashboard-state.service';
import {
  AppState,
  ConsumptionType,
  ReportType,
  TooltipLabel,
  Unit,
} from '../../core/utils/report-types-utils';
import { RoundingService } from '../../core/utils/rounding.service';
import { HeaderService } from '../../layout/header/services/header.service';
import { CollapsiblePanelComponent } from '../../shared/collapsible-panel/collapsible-panel.component';
import { ConsumptionComponent } from '../../shared/high-charts/consumption/consumption.component';
import { ExpensesComponent } from '../../shared/high-charts/expenses/expenses.component';
import { IZColumnChartComponent } from '../../shared/high-charts/iz-column-chart/iz-column-chart.component';
import { SpeedometerComponent } from '../../shared/high-charts/speedometer/speedometer.component';
import { AppStateService } from '../../shared/service/app-state.service';
import { ReloadService } from '../../shared/service/reload.service';
import { ToastService } from '../../shared/service/toast.service';
import { FacilityDashboardService } from '../dashboard/services/facility-dashboard.service';
import { WeatherService } from '../weather/services/weather.service';
import { ActionsComponent } from './components/actions/actions.component';
import { ConsumptionOverviewComponent } from './components/consumption-overview/consumption-overview.component';
import { DailyEleConsumptionComponent } from './components/daily-ele-consumption/daily-ele-consumption.component';
import { FiltersComponent } from './components/filters/filters.component';
//import { MonthlyEleConsumptionComponent } from './components/monthly-ele-consumption/monthly-ele-consumption.component';
import { ActionService } from './services/action.service';
import { BuildingDashboardService } from './services/building-dashboard.service';

@Component({
  selector: 'app-building-dashboard',
  standalone: true,
  imports: [
    ConsumptionOverviewComponent,
    FiltersComponent,
    ActionsComponent,
    DailyEleConsumptionComponent,
   // MonthlyEleConsumptionComponent,
    RouterModule,
    CommonModule,
    IZColumnChartComponent,
    ExpensesComponent,
    ConsumptionComponent,
    SpeedometerComponent,
    CollapsiblePanelComponent,
  ],
  templateUrl: './building-dashboard.component.html',
  styleUrl: './building-dashboard.component.css',
})
export class BuildingDashboardComponent implements OnInit {
  private subscriptions: Subscription = new Subscription();
  @ViewChild(DailyEleConsumptionComponent)
  dailyEleConsumptionComponent!: DailyEleConsumptionComponent;
  electricityData = this.dSS.electricityData;
  dashboardState = this.dSS.dashboardState;
  constructor(
    public dSS: DashboardStateService,
    private cdRef: ChangeDetectorRef,
    private appState: AppStateService,
    private facilityService: FacilityDashboardService,
    private weatherService: WeatherService,
    private buildingService: BuildingDashboardService,
    private headerService: HeaderService,
    private actionService: ActionService,
    private toastService: ToastService,
    private reloadService: ReloadService,
    private roundingService: RoundingService
  ) {
    this.appState.addParameter(AppState.ReportType, null);
    this.headerService.isLogin(true);
    dSS.dashboardState.userId.set(this.appState.getParameter(AppState.UserId));
    dSS.dashboardState.facilityId.set(
      this.appState.getParameter(AppState.FacilityId)
    );
    this.loadBuildings();
  }
  isFlagged = (value: number): boolean => false;

  ngOnInit() {
    this.dSS.dashboardState.locationId.set(
      this.appState.getParameter(AppState.LocationId)
    );
    this.actionService.reload$.subscribe((params: any) => {
      this.updateMonthlyActionData(params);
    });

    this.updateMonthlyData();
  }
  ngOnDestroy() {
    // Clean up subscriptions
    this.subscriptions.unsubscribe();
  }
  // General method to fetch data and process it
  private fetchConsumptionData(
    fetchFn: () => Observable<any[]>,
    stateKey: keyof typeof this.dSS.electricityData,
    isConsumption: boolean = true
  ): void {
    fetchFn().subscribe(
      (data: any[]) => {
        this.dSS.electricityData[stateKey].set((data as any).Table);

        const hasData = this.dSS.electricityData[stateKey]().length > 0;
        this.dSS.dashboardState[
          isConsumption ? 'isConsumptionHave' : 'isExpansionHave'
        ].set(hasData);
        if (hasData) {
          const table1 = (data as any).Table1;
          if (table1) {
            const total = table1.find(
              (item: { AssetName: string }) => item.AssetName === 'Total'
            );
            if (total) {
              this.dSS.dashboardState.totalConsumption.set(
                this.roundingService.roundToNearestInteger(total.value)
              );
            }
            this.dSS.electricityData[
              isConsumption ? 'summaryConsumption' : 'summaryExpansion'
            ].set(this.createSummaryFromData(table1, this.isFlagged));
          }
        }
      },
      (error) => console.error('Error fetching data:', error)
    );
  }

  // Helper method to handle all types of consumptions/expenses
  private updateMonthlyActionData(params: string): void {
    if (
      !this.dSS.dashboardState.facilityId() ||
      !this.dSS.dashboardState.userId() ||
      !this.dSS.dashboardState.locationId()
    ) {
      return;
    }

    switch (params) {
      case ReportType.ElectricityConsumption:
        this.monthlyConsumptions();
        this.monthlyExpenses();
        this.setStateMetadata(
          ReportType.ElectricityConsumption,
          Unit.kWh,
          TooltipLabel.ElectricityTotalConsumption
        );
        this.dSS.dashboardState.isConsumptionAndExpansionShow.set(false);
        break;

      case ReportType.GasConsumption:
        this.monthlyGasConsumptions();
        this.monthlyGasExpenses();
        this.setStateMetadata(
          ReportType.GasConsumption,
          Unit.Therms,
          TooltipLabel.GasTotalConsumption
        );
        this.dSS.dashboardState.isConsumptionAndExpansionShow.set(false);
        break;

      case ReportType.WaterConsumption:
        this.monthlyWaterConsumptions();
        this.monthlyWaterExpenses();
        this.setStateMetadata(
          ReportType.WaterConsumption,
          Unit.Liters,
          TooltipLabel.WaterTotalConsumption
        );
        this.dSS.dashboardState.isConsumptionAndExpansionShow.set(false);
        break;

      case ReportType.SustainabilityReport:
        this.dSS.dashboardState.isConsumptionShow.set(true);
        this.dSS.dashboardState.isExpansionHave.set(true);
        break;
      case ReportType.TrendAndIntensityReport:
        this.monthlyIntensityReport();
        this.monthlyTrendReport();
        this.setStateMetadata(
          ReportType.MonthlyTrend,
          Unit.kWh,
          TooltipLabel.MonthlyTrend
        );
        // this.dSS.dashboardState.isConsumptionShow.set(true);
        this.dSS.dashboardState.isConsumptionAndExpansionShow.set(true);
        break;
      case ReportType.PeakDemand:
        this.dSS.dashboardState.isConsumptionShow.set(true);
        this.dSS.dashboardState.isExpansionHave.set(true);
        break;
      case ReportType.ElectricityExpenses:
        this.dSS.dashboardState.isConsumptionShow.set(true);
        this.dSS.dashboardState.isExpansionHave.set(true);
        break;
      case ReportType.WeatherConsumption:
        this.dSS.dashboardState.isConsumptionShow.set(true);
        this.dSS.dashboardState.isExpansionHave.set(true);
        break;
    }
  }

  private setStateMetadata(
    reportType: string,
    unit: string,
    tooltipLabel: string
  ): void {
    this.dSS.dashboardState.name.set(reportType);
    // this.dSS.dashboardState.nameExpanses.set(
    //   reportType === ReportType.MonthlyTrend
    //     ? ReportType.MonthlyIntensity
    //     : ReportType.ElectricityExpenses
    // );
    // Map specific consumption report types to their corresponding expense types
    let expenseType: string;
    switch (reportType) {
      case 'Gas Consumption':
        expenseType = 'Gas Expense';
        break;
      case 'Water Consumption':
        expenseType = 'Water Expense';
        break;
      case 'Electric Consumption':
        expenseType = 'Electric Expense';
        break;
      case ReportType.MonthlyTrend:
        expenseType = ReportType.MonthlyIntensity;
        break;
      default:
        expenseType = 'Electricity Expenses'; // Default fallback
    }

    this.dSS.dashboardState.nameExpanses.set(expenseType);
    this.dSS.dashboardState.headerTitle.set(
      reportType === ReportType.MonthlyTrend
        ? 'Monthly Trend & Intensity'
        : 'Monthly Floors Consumption & Expenses'
    );
    this.dSS.dashboardState.chartType.set(
      reportType === ReportType.MonthlyTrend ? 'line' : 'column'
    );
    this.dSS.dashboardState.tooltip.set(tooltipLabel);
    this.dSS.dashboardState.tooltipTitle.set(unit);
    this.dSS.dashboardState.isConsumptionShow.set(false);
  }

  // Consolidated data fetching methods for electricity, gas, and water
  monthlyConsumptions(): void {
    this.fetchConsumptionData(
      () =>
        this.buildingService.GetMonthlyElectricityConsumption(
          this.dSS.dashboardState.facilityId()!,
          this.dSS.dashboardState.userId()!,
          this.dSS.dashboardState.locationId()!
        ),
      ConsumptionType.Consumption
    );
  }

  monthlyExpenses(): void {
    this.fetchConsumptionData(
      () =>
        this.buildingService.GetMonthlyElectricityExpenses(
          this.dSS.dashboardState.facilityId()!,
          this.dSS.dashboardState.userId()!,
          this.dSS.dashboardState.locationId()!
        ),
      ConsumptionType.Expansion,
      false
    );
  }

  monthlyGasConsumptions(): void {
    this.fetchConsumptionData(
      () =>
        this.buildingService.GetMonthlyGasConsumption(
          this.dSS.dashboardState.facilityId()!,
          this.dSS.dashboardState.userId()!,
          this.dSS.dashboardState.locationId()!
        ),
      ConsumptionType.Consumption
    );
  }

  monthlyGasExpenses(): void {
    this.fetchConsumptionData(
      () =>
        this.buildingService.GetMonthlyGasExpenses(
          this.dSS.dashboardState.facilityId()!,
          this.dSS.dashboardState.userId()!,
          this.dSS.dashboardState.locationId()!
        ),
      ConsumptionType.Expansion,
      false
    );
  }

  monthlyWaterConsumptions(): void {
    this.fetchConsumptionData(
      () =>
        this.buildingService.GetMonthlyWaterConsumption(
          this.dSS.dashboardState.facilityId()!,
          this.dSS.dashboardState.userId()!,
          this.dSS.dashboardState.locationId()!
        ),
      ConsumptionType.Consumption
    );
  }

  monthlyWaterExpenses(): void {
    this.fetchConsumptionData(
      () =>
        this.buildingService.GetMonthlyWaterExpenses(
          this.dSS.dashboardState.facilityId()!,
          this.dSS.dashboardState.userId()!,
          this.dSS.dashboardState.locationId()!
        ),
      ConsumptionType.Expansion,
      false
    );
  }

  monthlyTrendReport(): void {
    this.fetchConsumptionData(
      () =>
        this.buildingService.GetMonthlyTrendReport(
          this.dSS.dashboardState.facilityId()!,
          this.dSS.dashboardState.userId()!,
          this.dSS.dashboardState.locationId()!
        ),
      ConsumptionType.Consumption
    );
  }

  monthlyIntensityReport(): void {
    this.fetchConsumptionData(
      () =>
        this.buildingService.GetMonthlyIntensityReport(
          this.dSS.dashboardState.facilityId()!,
          this.dSS.dashboardState.userId()!,
          this.dSS.dashboardState.locationId()!
        ),
      ConsumptionType.Expansion
    );
  }

  updateMonthlyData(): void {
    const actionType = this.appState.getParameter(AppState.ReportType);
    this.updateMonthlyActionData(actionType);
  }

  // Function to create summary from data
  createSummaryFromData(
    data: Array<{ AssetID: number; AssetName: string; value: number }>,
    flagCondition: (value: number) => boolean
  ): Summary[] {
    return data.map((item) => ({
      Name: item.AssetName,
      value: this.roundingService.roundToNearestInteger(item.value),
      flag: flagCondition(item.value),
    }));
  }

  // Function to load buildings (unchanged for brevity)
  loadBuildings(): void {
    if (
      !this.dSS.dashboardState.facilityId() ||
      !this.dSS.dashboardState.userId()
    )
      return;
    this.facilityService
      .getBuildings(
        this.dSS.dashboardState.facilityId(),
        this.dSS.dashboardState.userId()
      )
      .subscribe(
        (data) => {
          this.dSS.dashboardState.locations.set((data as any).Table);
          this.setSelectedIndex();
        },
        (error) => console.error('Error fetching buildings:', error)
      );
  }

  setSelectedIndex(): void {
    const index = this.dSS.dashboardState
      .locations()
      .findIndex(
        (location) =>
          location.LocationID === this.dSS.dashboardState.locationId()
      );
    if (index !== -1) {
      this.dSS.dashboardState.selectedIndex.set(index);
      this.setLocationData(this.dSS.dashboardState.locations()[index]);
      this.updateWeather(this.dSS.dashboardState.locations()[index]);
    }
  }

  updateWeather(location: any): void {
    const countryCode: string = getCountryCode(
      location?.CountryName ?? 'us'
    ) as string;
    this.weatherService.getWeather(
      location.Latitud ?? '94040',
      location.Longitude,
      location.locationName,
      0
    );
  }

  setLocationData(location: any) {
    this.appState.addParameter(AppState.LocationId, location.LocationID);
    this.appState.addParameter(AppState.LocationName, location.LocationName);
    this.dSS.dashboardState.locationId.set(location.LocationID);
  }

  // selectLocation(index: number, location: any): void {
  //   if (location.SiteID == null) {
  //     this.buildingService
  //       .GetsetSettingDetails(
  //         'Daily',
  //         this.dSS.dashboardState.userId()!,
  //         location.LocationID
  //       )
  //       .subscribe((data: any[]) => {
  //         const siteData = (data as any).Table;
  //         if (siteData && siteData.length > 0) {
  //           const CurrentSiteID = siteData[0];
  //           if (CurrentSiteID == null) {
  //             return;
  //           }
  //         } else {
  //           this.toastService.showToast({
  //             text: 'Date range not added.',
  //             type: 'warning',
  //           });
  //           return;
  //         }
  //       });
  //   }
  //   const actionType = this.appState.getParameter('actionType');

  //   this.dSS.dashboardState.selectedIndex.set(index);
  //   this.appState.addParameter('locationId', location.LocationID);
  //   this.appState.addParameter('locationData', location);
  //   this.dailyEleConsumptionComponent.fetchChartData(
  //     actionType,
  //     this.dSS.dashboardState.facilityId()!,
  //     this.dSS.dashboardState.userId()!,
  //     location.LocationID!
  //   );
  //   this.setLocationData(location);
  //   this.updateMonthlyData();
  //   this.reloadService.requestReload();
  // }
  selectLocation(index: number, location: any): void {
    // Clear chart data before fetching new data
    this.clearAllChartData();

    if (location.SiteID == null) {
      this.buildingService
        .GetsetSettingDetails(
          'Daily',
          this.dSS.dashboardState.userId()!,
          location.LocationID
        )
        .subscribe((data: any[]) => {
          const siteData = (data as any).Table;
          if (siteData && siteData.length > 0) {
            const CurrentSiteID = siteData[0];
            if (CurrentSiteID == null) {
              return;
            }
          } else {
            this.toastService.showToast({
              text: 'Date range not added.',
              type: 'warning',
            });
            return;
          }
        });
    }

    const actionType = this.appState.getParameter('actionType');
            
    this.dSS.dashboardState.selectedIndex.set(index);
    this.appState.addParameter('locationId', location.LocationID);
    this.appState.addParameter('locationData', location);
    this.dailyEleConsumptionComponent.fetchChartData(
      actionType,
      this.dSS.dashboardState.facilityId()!,
      this.dSS.dashboardState.userId()!,
      location.LocationID!
    );
    this.setLocationData(location);
    //const actionType = this.appState.getParameter(AppState.ReportType);
    this.updateMonthlyActionData(actionType);
    // this.updateMonthlyData();
    this.cdRef.detectChanges();
    this.reloadService.requestReload();
  }

  // Helper method to clear all chart data
  clearAllChartData(): void {
    // Reset electricity consumption and expansion data
    this.dSS.electricityData.consumption.set([]);
    this.dSS.electricityData.expansion.set([]);
    this.dSS.electricityData.summaryConsumption.set([]);
    this.dSS.electricityData.summaryExpansion.set([]);
    this.dSS.dashboardState.totalConsumption.set(0);

    // Optionally, reset other chart-related states if needed
    this.dSS.dashboardState.isConsumptionHave.set(false);
    this.dSS.dashboardState.isExpansionHave.set(false);
    this.dSS.dashboardState.isConsumptionShow.set(false);
    this.dSS.dashboardState.isConsumptionAndExpansionShow.set(false);
  }

  hasPositiveValue(): boolean {
    return this.dSS.electricityData
      .summaryConsumption()
      .some((item) => item.value > 0);
  }

  hasPositiveEValue(): boolean {
    return this.dSS.electricityData
      .summaryExpansion()
      .some((item) => item.value > 0);
  }
}
