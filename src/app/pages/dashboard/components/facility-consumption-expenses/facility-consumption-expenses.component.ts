import { Component, Input, OnInit, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Facility } from '../../../../core/models/facility';
import {
  ChartData,
  Summary,
  TableEntry,
  Total,
} from '../../../../core/models/model';
import { RoundingService } from '../../../../core/utils/rounding.service';
import { CollapsiblePanelComponent } from '../../../../shared/collapsible-panel/collapsible-panel.component';
import { ColumnChartComponent } from '../../../../shared/high-charts/column-chart/column-chart.component';
import { ConsumptionComponent } from '../../../../shared/high-charts/consumption/consumption.component';
import { ExpensesComponent } from '../../../../shared/high-charts/expenses/expenses.component';
import { SpeedometerComponent } from '../../../../shared/high-charts/speedometer/speedometer.component';
import { FacilityCommunicationService } from '../../services/facility-communication.service';
import { FacilityDashboardService } from '../../services/facility-dashboard.service';
import { FacilityColumnChartComponent } from '../facility-column-chart/facility-column-chart.component';

@Component({
  selector: 'app-facility-consumption-expenses',
  standalone: true,
  imports: [
    FacilityColumnChartComponent,
    ColumnChartComponent,
    ConsumptionComponent,
    ExpensesComponent,
    SpeedometerComponent,
    CollapsiblePanelComponent,
  ],
  templateUrl: './facility-consumption-expenses.component.html',
  styleUrl: './facility-consumption-expenses.component.css',
})
export class FacilityConsumptionExpensesComponent implements OnInit {
  @Input() facilitiesData: Facility | undefined;

  label: string = '';
  type: string = '';
  title: string = '';

  loading$!: Observable<boolean>;
  constructor(
    private facilityService: FacilityDashboardService,
    private communicationService: FacilityCommunicationService,
    private roundingService: RoundingService
  ) {}

  ngOnInit() {
    this.communicationService.reloadChart$.subscribe(({ fid, userID }) => {
      this.loadFacilities(fid!, 1);
      this.loadConsumption(fid!, 1);
    });
    this.loadFacilities(this.facilitiesData?.FacilitiesID!, 1);
    this.loadConsumption(this.facilitiesData?.FacilitiesID!, 1);
  }

  chartData: TableEntry[] = [];
  summaryData: any[] = [];

  loadFacilities(fId: number, uId: number): void {
    this.chartData = [];
    this.summaryData = [];

    const isFlagged = (value: number): boolean => false;
    this.facilityService.GetDashboardEleExpenses(fId, uId).subscribe(
      (data: any) => {
        this.chartData = data.Table as TableEntry[];

        this.summaryData = this.createSummaryFromData(
          (data as any).Table1,
          isFlagged
        );
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  isValueValid(data: { Value: any }): boolean {
    // Check if Value is neither null nor 0
    return data.Value !== null && data.Value !== 0;
  }

  createSummaryFromData(
    data: Array<{ AssetID: number; BuildingName: string; Value: number }>,
    flagCondition: (value: number) => boolean
  ): Summary[] {
    return data.map((item) => ({
      Name: item.BuildingName,
      value: this.roundingService.roundToNearestInteger(item.Value),
      flag: flagCondition(item.Value),
    }));
  }

  consumptionData: ChartData[] = [];
  summaryChatData: Summary[] = [];
  summaryConsumption: Summary[] = [];
  total!: Total;
  totalConsumption = signal<number>(0);

  loadConsumption(fId: number, uId: number): void {
    this.consumptionData = [];
    this.summaryChatData = [];
    this.summaryConsumption = [];
    this.facilityService.GetDashboardEleConsumption(fId, uId).subscribe(
      (data: any) => {
        this.consumptionData = data.Table as ChartData[];
        this.summaryChatData = data.Table1 as Summary[];
        //this.summaryConsumption = data.Table1 as Summary[];
        if (data.Table1.length > 0) {
          this.summaryConsumption = (data.Table1 as Summary[]).map((item) => ({
            ...item,
            value: this.roundingService.roundToNearestInteger(item.value),
          }));
        } else {
          this.summaryConsumption = [] as Summary[];
        }

        //const sumValues: number = this.summaryChatData.reduce((total, summary) => total + summary.value, 0);
        const sumValues: number = this.summaryChatData.reduce(
          (total, summary) => {
            // Check if the value is null or undefined
            if (summary.value === null || summary.value === undefined) {
              // Skip null values
              return this.roundingService.roundToNearestInteger(total);
            }
            // Add valid values to the total
            return this.roundingService.roundToNearestInteger(
              total + summary.value
            );
          },
          0
        );

        // Round the sum to two decimal places
        const roundedSum: number =
          this.roundingService.roundToNearestInteger(sumValues);
        const newSummary: any = {
          Name: 'Total',
          value: roundedSum,
          flag: true,
        };
        this.summaryChatData.push(newSummary);
        this.totalConsumption = signal<number>(roundedSum);
        this.total = roundedSum as unknown as Total;
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }
}
