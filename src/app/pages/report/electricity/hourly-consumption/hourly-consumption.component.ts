import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { environment } from '../../../../../environments/environment';
import { ChartSeries } from '../../../../core/models/model';
import { AssetType, ReportType } from '../../../../core/models/types';
import { CollapsiblePanelComponent } from '../../../../shared/collapsible-panel/collapsible-panel.component';
import { PointFormatTypePipe } from '../../../../shared/pipes/PointFormatType.pipe';
import { ReportUnitTitlePipe } from '../../../../shared/pipes/ReportUnitTitle.pipe';
import { AppStateService } from '../../../../shared/service/app-state.service';
import { ChartService } from '../../services/chart.service';
import {
  DataProcessorService,
  ProcessedData,
} from '../../services/data-processor.service';
import { ReportService } from '../../services/report.service';
const baseUrl = environment.baseUrl + 'report/';
@Component({
  selector: 'app-hourly-consumption',
  standalone: true,
  imports: [CommonModule, HighchartsChartModule, CollapsiblePanelComponent],
  templateUrl: './hourly-consumption.component.html',
  styleUrl: './hourly-consumption.component.css',
})
export class HourlyConsumptionComponent implements OnChanges, OnInit {
  @ViewChild('content') content!: ElementRef;
  @Input() seriesData: ChartSeries[] = [];
  @Input() filterType!: ReportType;
  @Output() buildingIdChange = new EventEmitter<number>();
  @Output() assetsChange = new EventEmitter<any[]>();
  @Input() title!: any;
  @Input() unitType!: any;
  @Input() maxLine: number = 0;

  chart?: Highcharts.Chart;
  chartOptions!: Highcharts.Options;
  loading: boolean = false;
  Highcharts: typeof Highcharts = Highcharts;
  chartType: string = '';
  actionType: string = '';
  dynamicTitle: string = '';
  pointType: string = '';

  constructor(
    private dataProcessor: DataProcessorService,
    private appState: AppStateService,
    private rs: ReportService,
    private chartService: ChartService
  ) {
    this.chartType = 'column';
    this.actionType = this.appState.getParameter('actionType');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['seriesData'] &&
      changes['seriesData'].currentValue !== changes['seriesData'].previousValue
    ) {
      this.seriesData = changes['seriesData'].currentValue;
      if (this.seriesData.length > 0) {
        this.processData();
      }
    }
    this.setDynamicTitle();
  }

  ngOnInit() {
    if (!this.chartOptions) {
      this.chartOptions = { xAxis: { categories: [] }, series: [] };
    }
  }

  setDynamicTitle() {
    //const units = new ReportUnitTitlePipe().transform(this.actionType);
    this.dynamicTitle = `${this.title}  (${this.unitType})`;
  }
  private pointFormatTypePipe = new PointFormatTypePipe();
  processData() {
    const processedData: ProcessedData = this.dataProcessor.processData(
      this.seriesData,
      this.filterType
    );
    this.chartType =
      this.title === 'Monthly Trend Report'
        ? 'line'
        : this.title === 'Monthly Peak Demand'
        ? 'scatter'
        : 'column';

    const units = new ReportUnitTitlePipe().transform(this.actionType);

    // Check if filterType is equal to 'MonthlyPeakDemand'
    if (this.filterType === 'MonthlyPeakDemand') {
      this.chartOptions = this.chartService.generateChartOptionsdatePeak(
        processedData,
        `${this.title}`,
        this.chartType,
        this.unitType,
        this.unitType,
        this.maxLine
      );
    } else {
      this.pointType = this.pointFormatTypePipe.transform(this.unitType);
      this.chartOptions = this.chartService.generateChartOptions(
        processedData,
        `${this.title}`,
        this.chartType,
        this.unitType,
        this.unitType,
        this.maxLine,
        this.pointType
      );
    }

    // Common chart options
    this.chartOptions.plotOptions = {
      column: { pointPadding: 0.2, borderWidth: 0 },
      series: {
        events: {
          legendItemClick: (event: any) => this.handleLegendItemClick(event),
        },
      },
    };

    this.renderChart();
  }

  handleLegendItemClick(event: any): boolean {
    const buildingName = event.target.name;

    const assetData = this.seriesData.find(
      (item) => item.AssetName === buildingName
    );
    if (!assetData) {
      return false;
    }
    const buildingID = assetData.AssetID.toString();

    this.loadAssetChart(
      this.actionType.toString() as AssetType,
      buildingID,
      buildingName,
      this.filterType
    );
    return false; // Prevent the default action (toggling series visibility)
  }

  renderChart() {
    if (this.chart) {
      this.chartService.destroyChart(this.chart);
    }
    this.chart = this.chartService.createChart(
      'chart-container',
      this.chartOptions
    );
  }

  // Refactored method to load asset chart data
  loadAssetChart(
    assetType: AssetType,
    buildingId: string,
    buildingName: string,
    type: ReportType
  ): void {
    if (!buildingId) return;

    const id = parseInt(buildingId, 10);
    if (isNaN(id)) return;
    this.loading = true;

    this.buildingIdChange.emit(id);
    const parameters = {
      type,
      id,
      facilityId: this.appState.getParameter('facilityId'),
      userId: this.appState.getParameter('userId'),
      locationId: this.appState.getParameter('locationId'),
    };
    let getDataObservable;
    // Mapping from asset type to corresponding service method
    switch (assetType) {
      case 'Water Consumption':
        getDataObservable = () => this.rs.getWaterAssetData(parameters);
        break;
      case 'Electricity Consumption':
        getDataObservable = () => this.rs.getElectricityAssetData(parameters);
        break;
      case 'Gas Consumption':
        getDataObservable = () => this.rs.getGasAssetData(parameters);
        break;
      default:
        console.error('Unsupported assetType:', assetType);
        return;
    }

    if (!getDataObservable) return;

    getDataObservable().subscribe(
      (data: any) => {
        this.seriesData = data.Table;
        this.updateAssetChart(data.Table, type, buildingName);
        this.assetsChange.emit(data.Table);
      },
      (error) => console.error(`Error fetching ${assetType} data:`, error)
    );
  }

  updateAssetChart(data: any[], type: any, buildingName: string): void {
    const processedData: ProcessedData = this.dataProcessor.processData(
      data,
      this.filterType
    );
    const units = new ReportUnitTitlePipe().transform(this.actionType);
    this.chartOptions = this.chartService.generateChartOptions(
      processedData,
      `Asset  ${this.filterType} ${this.actionType} for ${buildingName}`,
      'line',
      units,
      units
    );
    this.renderChart();
    this.appState.addParameter(
      'FloorName',
      `Asset  ${this.filterType} ${this.actionType} for ${buildingName}`
    );
  }
}
