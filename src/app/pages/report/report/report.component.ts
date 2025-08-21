import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { ChartSeries } from '../../../core/models/model';
import { ReportType } from '../../../core/models/types';
import { AppState } from '../../../core/utils/report-types-utils';
import { HeaderService } from '../../../layout/header/services/header.service';
import { CollapsiblePanelComponent } from '../../../shared/collapsible-panel/collapsible-panel.component';
import { RoundingPipe } from '../../../shared/pipes/rounding.pipe';
import { ReportAgainstBudgetTableComponent } from '../../../shared/report-against-budget-table/report-against-budget-table.component';
import { ReportTableComponent } from '../../../shared/report-table/report-table.component';
import { AppStateService } from '../../../shared/service/app-state.service';
import { FiltersComponent } from '../../building-dashboard/components/filters/filters.component';
import { AuthService } from '../../login/services/auth.service';
import { ImageUploadEventService } from '../../setting/components/upload-image/service/image-upload-event.service';
import { TemplateService } from '../download/services/template.service';
import { HourlyConsumptionComponent } from '../electricity/hourly-consumption/hourly-consumption.component';
import { DateHandler } from '../helper/dateHandler';
import { DataProcessorService } from '../services/data-processor.service';
import { FilterTypeLogicService } from '../services/filter-type-logic.service';
import { FilterService } from '../services/filter.service';
import { ReportService } from '../services/report.service';

@Component({
  selector: 'app-report',
  standalone: true,
  templateUrl: './report.component.html',
  styleUrl: './report.component.css',
  imports: [
    HourlyConsumptionComponent,
    CommonModule,
    FiltersComponent,
    CollapsiblePanelComponent,
    ReportTableComponent,
    RouterModule,
    RoundingPipe,
    ReportAgainstBudgetTableComponent,
  ],
})

// report.component.ts
export class ReportComponent implements OnInit, OnDestroy {
  //public icon$ = this.imageUploadEvent.getIconSignal();
  private ngUnsubscribe = new Subject<void>();

  // Component properties
  userId?: number;
  facilityId?: number;
  locationId?: number;
  buildingId?: number;
  name: string = '';
  tooltip: string = '';
  seriesData: ChartSeries[] = [];
  filterType = signal<ReportType>('Hourly');
  tableData: any[] = [];
  assets: ChartSeries[] = [];
  unitType = signal('kWh');
  conclusion: any[] = [];
  reportFullName = signal('');
  location = signal('');
  facility = signal('');
  reportDate = signal('');
  startDate = signal('');
  endDate = signal('');
  MaxLine = signal<number>(0);

  // Subscriptions
  private emailReportSubscription?: Subscription;
  private downloadReportSubscription?: Subscription;

  constructor(
    private headerService: HeaderService,
    private appState: AppStateService,
    private reportService: ReportService,
    private filterService: FilterService,
    private datePipe: DatePipe,
    private dataProcessor: DataProcessorService,
    private filterTypeLogicService: FilterTypeLogicService,
    private templateService: TemplateService,
    private authService: AuthService,
    private filterTypeLogic: FilterTypeLogicService,
    private imageUploadEvent: ImageUploadEventService
  ) {
    this.initializeComponent();
  }

  private initializeComponent(): void {
    this.headerService.isLogin(true);
    this.setInitialParams();
    this.handlePdfDownload();
    this.handleEmailReport();
    this.toggleButton(true);
  }

  private setInitialParams(): void {
    this.userId = this.appState.getParameter('userId');
    this.facilityId = this.appState.getParameter('facilityId');
    this.locationId = this.appState.getParameter('locationId');
    this.facility.set(this.appState.getParameter('facilityName'));
    this.location.set(this.appState.getParameter('locationName'));
  }

  ngOnInit(): void {
    this.setInitialParams();
    this.subscribeToReportReload();
  }

  private subscribeToReportReload(): void {
    this.filterService.reloadReport.subscribe((params: any) => {
      this.filterType.set(params);
      const type = this.filterTypeLogicService.getFilterType();
      const actionType = this.appState
        .getParameter('actionType')
        ?.trim()
        .toLowerCase();
      this.setTitle(params);
      this.fetchData(actionType, type);
    });
  }

  private fetchData(actionType: string, type: ReportType): void {
    const fetchMethods: { [key: string]: (type: ReportType) => void } = {
      'electricity consumption': this.fetchElectricityData.bind(this),
      'gas consumption': this.fetchGasData.bind(this),
      'water consumption': this.fetchWaterData.bind(this),
      'sustainability report': this.fetchSustainabilityData.bind(this),
      'trend and intensity report': this.fetchTrendAndIntensityData.bind(this),
      'peak demand': this.fetchPeakDemandData.bind(this),
      'electricity expenses': this.fetchElectricityExpensesData.bind(this),
    };

    const fetchMethod = fetchMethods[actionType];
    if (fetchMethod) {
      fetchMethod(type);
    } else {
      console.warn(`No fetch method available for action type: ${actionType}`);
    }
  }

  private handlePdfDownload(): void {
    this.downloadReportSubscription =
      this.filterService.downloadReport.subscribe(async (params: any) => {
        this.templateService.downloadHtmlFile(
          this.seriesData,
          this.assets,
          params,
          this.facility(),
          this.location(),
          this.endDate(),
          this.reportFullName(),
          this.startDate(),
          this.appState.getParameter('chartType'),
          this.unitType(),
          this.appState.getParameter('FloorName'),
          this.authService.getUsername() ?? 'Unknown User',
          this.MaxLine(),
          this.appState.getParameter(AppState.FTimezone)
        );
      });
  }
  private handleEmailReport(): void {
    this.emailReportSubscription = this.filterService.emailReport.subscribe(
      async (params: any) => {
        this.templateService.generateEmailReport(
          params.email,
          this.seriesData,
          this.assets,
          params.reportType,
          this.facility(),
          this.location(),
          this.endDate(),
          this.reportFullName(),
          this.startDate(),
          this.appState.getParameter('chartType'),
          this.unitType(),
          this.appState.getParameter('FloorName'),
          this.authService.getUsername() ?? 'Unknown User',
          this.MaxLine(),
          this.appState.getParameter(AppState.FTimezone)
        );
      }
    );
  }

  private setTitle(params: any): void {
    const actionType = this.appState.getParameter('actionType');
    const title = this.generateTitle(actionType, params);
    this.reportFullName.set(title);
  }

  private generateTitle(actionType: string, params: any): string {
    if (actionType === 'Trend and Intensity Report') {
      switch (params) {
        case 'Hourly':
          return 'Hourly Intensity Report';
        case 'Monthly':
          return 'Monthly Intensity Report';
        case 'Daily':
          return 'Daily Intensity Report';
        case 'Yearly':
          return 'Yearly Intensity Report';
      }
    } else if (actionType === 'Electricity Expenses') {
      switch (params) {
        case 'MonthlyAgainstBudget':
          return 'Monthly Electricity Expenses against budget';
        case 'YearlyAgainstBudget':
          return 'Yearly Electricity Expenses against budget';
      }
    }

    const titleMap: { [key: string]: string } = {
      MonthlyTrend: 'Monthly Trend Report',
      MonthlyPeakDemand: 'Monthly Peak Demand',
    };

    // Fallback if params does not match any key in titleMap
    return titleMap[params] ?? `${params} ${actionType}`;
  }

  private setStartAndEndDate(type: string, seriesData: ChartSeries[]): void {
    if (!seriesData.length) {
      this.handleEmptyData();
      return;
    }

    this.toggleButton(false);

    const processedData = this.dataProcessor.processData(seriesData, type);
    this.conclusion = processedData.conclusion;

    const dateHandler = new DateHandler(seriesData, type);
    const transformedStartDate = this.datePipe.transform(
      dateHandler.startDate,
      dateHandler.getDateFormat(type)
    );
    this.startDate.set(transformedStartDate ?? '');

    if (type !== 'Hourly') {
      const transformedEndDate = this.datePipe.transform(
        dateHandler.endDate,
        dateHandler.getDateFormat(type)
      );
      this.endDate.set(transformedEndDate ?? '');
    } else {
      this.endDate.set('');
    }
  }

  private handleEmptyData(): void {
    console.error('No data available');
    this.toggleButton(true);
    this.conclusion = [];
  }

  private toggleButton(state: boolean): void {
    this.filterService.triggerEmailEnable(state);
  }

  ngOnDestroy(): void {
    this.cleanUp();
  }

  private cleanUp(): void {
    this.appState.addParameter('reportType', null);
    this.emailReportSubscription?.unsubscribe();
    this.downloadReportSubscription?.unsubscribe();
  }

  // Fetch methods

  private fetchElectricityData(type: ReportType): void {
    this.fetchDataForType(
      type,
      this.reportService.getElectricityData.bind(this.reportService),
      'kWh'
    );
  }

  private fetchGasData(type: ReportType): void {
    this.fetchDataForType(
      type,
      this.reportService.getGasData.bind(this.reportService),
      'Therms'
    );
  }

  private fetchWaterData(type: ReportType): void {
    this.fetchDataForType(
      type,
      this.reportService.getWaterData.bind(this.reportService),
      'Liter'
    );
  }

  private fetchSustainabilityData(type: ReportType): void {
    this.fetchDataForType(
      type,
      this.reportService.getSustainabilityData.bind(this.reportService),
      'kg/kWh'
    );
  }

  private fetchTrendAndIntensityData(type: ReportType): void {
    this.fetchDataForType(
      type,
      this.reportService.getTrendAndIntensityData.bind(this.reportService),
      this.getUnit.bind(this)
    );
  }

  private fetchPeakDemandData(type: ReportType): void {
    this.fetchDataForType(
      type,
      this.reportService.getPeakDemandData.bind(this.reportService),
      this.getUnit.bind(this)
    );
  }

  private fetchElectricityExpensesData(type: ReportType): void {
    this.fetchDataForType(
      type,
      this.reportService.getElectricityExpensesData.bind(this.reportService),
      this.getUnit.bind(this)
    );
  }

  private fetchDataForType(
    type: ReportType,
    fetchMethod: Function,
    unitTypeCallback: string | Function
  ): void {
    if (this.facilityId && this.userId && this.locationId) {
      fetchMethod(
        type,
        this.facilityId,
        this.userId,
        this.locationId
      ).subscribe(
        (data: any) => {
          this.seriesData = data.Table;

          this.setStartAndEndDate(type, this.seriesData);

          if (typeof unitTypeCallback === 'string') {
            this.unitType.set(unitTypeCallback);
          } else {
            this.unitType.set(unitTypeCallback(this.seriesData));
          }
          if (
            type === 'MonthlyAgainstBudget' ||
            type === 'YearlyAgainstBudget'
          ) {
            this.MaxLine.set(this.getTargetBudgetForAssetId0(data.Table1));
            this.assets = data.Table1;
          } else {
            this.MaxLine.set(0);
            this.assets = this.seriesData;
          }
        },
        (error: any) => this.handleError(error)
      );
    }
  }
  getTargetBudgetForAssetId0(data: any[]): number {
    const otherTargetBudgets = data
      .filter((item) => item.AssetID !== 0)
      .map((item) => item.TargetBudget);

    const totalOtherTargetBudgets = otherTargetBudgets.reduce(
      (acc, budget) => acc + budget,
      0
    );

    return totalOtherTargetBudgets;
  }
  private handleError(error: any): void {
    console.error('Error fetching data:', error);
  }
  filterTypeSet(): ReportType {
    return this.filterTypeLogic.getFilterType();
  }
  onAssetsChange(newAssets: any[]) {
    const type = this.filterTypeLogic.getFilterType();
    this.appState.addParameter('chartType', 'line');
    this.setStartAndEndDate(type, newAssets);
    this.assets = newAssets;
  }

  private getUnit(groupedData: any): string {
    return groupedData[0]?.Unit ?? 'Unknown';
  }
}
