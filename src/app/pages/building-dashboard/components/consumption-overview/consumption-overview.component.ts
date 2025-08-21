import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  ConsumptionData,
  defaultConsumptionData,
} from '../../../../core/models/consumption-data.model';
import { RoundingService } from '../../../../core/utils/rounding.service';
import { ConsumptionsOverviewChartComponent } from '../../../../shared/high-charts/consumptions-overview-chart/consumptions-overview-chart.component';
import { CompactNumberPipe } from '../../../../shared/pipes/compact-number.pipe';
import { RemoveNegativeSignPipe } from '../../../../shared/pipes/remove-negative-sign.pipe';
import { RoundingPipe } from '../../../../shared/pipes/rounding.pipe';
import { AppStateService } from '../../../../shared/service/app-state.service';
import { ReloadService } from '../../../../shared/service/reload.service';
import { WeatherComponent } from '../../../weather/weather.component';
import { BuildingDashboardService } from '../../services/building-dashboard.service';

@Component({
  selector: 'app-consumption-overview',
  standalone: true,
  templateUrl: './consumption-overview.component.html',
  styleUrl: './consumption-overview.component.css',
  imports: [
    ConsumptionsOverviewChartComponent,
    WeatherComponent,
    RemoveNegativeSignPipe,
    CompactNumberPipe,
    CommonModule,
    RoundingPipe,
  ],
})
export class ConsumptionOverviewComponent implements OnInit {
  private subscription: Subscription;
  @ViewChild(WeatherComponent, { static: true })
  weatherComponent!: WeatherComponent;
  consumptionData: ConsumptionData = { ...defaultConsumptionData };

  facilityId?: number;
  locationId?: number;
  locationName = signal('');
  totalValueType = signal('');
  userId?: number;

  constructor(
    private reloadService: ReloadService,
    private buildingService: BuildingDashboardService,
    private appState: AppStateService,
    private roundingService: RoundingService
  ) {
    this.subscription = this.reloadService.reloadObservable$.subscribe(() => {
      this.ngOnInit();
    });
  }

  ngOnInit() {
    this.userId = this.appState.getParameter('userId');
    this.facilityId = this.appState.getParameter('facilityId');
    this.locationId = this.appState.getParameter('locationId');
    let data = this.appState.getParameter('locationName');
    this.locationName.set(data);
    this.weatherComponent.getWeather();
    this.loadElectricity(this.facilityId!, this.userId!, this.locationId!);
    this.loadGas(this.facilityId!, this.userId!, this.locationId!);
    this.loadWater(this.facilityId!, this.userId!, this.locationId!);
    this.loadConsumptionTotal(
      this.facilityId!,
      this.userId!,
      'Electric',
      this.locationId!
    );
    this.loadConsumptionTotal(
      this.facilityId!,
      this.userId!,
      'Water',
      this.locationId!
    );
    this.loadConsumptionTotal(
      this.facilityId!,
      this.userId!,
      'Gas',
      this.locationId!
    );
  }

  loadElectricity(fId: number, uId: number, locationId: number): void {
    let response: any[] = [];
    this.buildingService
      .GetWeeklyElectricityConsumption(fId, uId, locationId)
      .subscribe(
        (data: any[]) => {
          response = (data as any).Table;
          this.consumptionData.electric.chartData = response.map(
            (item, index) => this.mapToElectricityData(item, index)
          );
        },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );
  }

  loadGas(fId: number, uId: number, locationId: number): void {
    let response: any[] = [];
    this.buildingService
      .GetWeeklyGasConsumption(fId, uId, locationId)
      .subscribe(
        (data: any[]) => {
          response = (data as any).Table;
          this.consumptionData.gas.chartData = response.map((item, index) =>
            this.mapToElectricityData(item, index)
          );
        },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );
  }

  loadWater(fId: number, uId: number, locationId: number): void {
    let response: any[] = [];
    this.buildingService
      .GetWeeklyWaterConsumption(fId, uId, locationId)
      .subscribe(
        (data: any[]) => {
          response = (data as any).Table;
          this.consumptionData.water.chartData = response.map((item, index) =>
            this.mapToElectricityData(item, index)
          );
        },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );
  }

  getDayOfWeek(dayNumber: number): string {
    const daysOfWeek = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    return daysOfWeek[dayNumber]; // Adjust for array index
  }

  getRandomColor(dayNumber: number): string {
    const daysOfWeek = [
      '#008ffb',
      '#00e396',
      '#feb019',
      '#ff4560',
      '#775dd0',
      'rgba(0,143,251,0.85)',
      'rgba(0,227,150,0.85)',
    ];
    return daysOfWeek[dayNumber];
  }

  mapToElectricityData(item: any, index: number): ChartData {
    const day = item.Day;
    const month = item.DateMonth - 1; // JavaScript months are 0-based
    const year = item.GetYear;
    const date = new Date(year, month, day);
    const dayOfWeek = this.getDayOfWeek(date.getDay());
    const formattedDate = date.toLocaleDateString('default', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    return {
      x: `${dayOfWeek}, ${formattedDate}`, // Combine day of the week and formatted date
      y: item.Value,
      fillColor: this.getRandomColor(index),
      date: date.toDateString(), // Convert date to string
      unit: item.Unit, // Add unit to the data
    };
  }

  loadConsumptionTotal(
    fid: number,
    userId: number,
    assetsType: string,
    locationId: number
  ): void {
    this.buildingService
      .GetTotalConsumptions(fid, userId, assetsType, locationId)
      .subscribe(
        (data: any) => {
          const getData = (data as any).Table;
          const consumptionData = getData[0]; // Extracting first element of the data array

          switch (assetsType) {
            case 'Electric':
              this.setElectricityData(consumptionData);
              break;
            case 'Gas':
              this.setGasData(consumptionData);
              break;
            case 'Water':
              this.setWaterData(consumptionData);
              break;
            default:
              console.error('Invalid assets type:', assetsType);
              break;
          }
        },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );
  }

  private setElectricityData(data: any): void {
    this.consumptionData.electric.percentage = data.Percentage ?? 0;
    this.totalValueType.set(data.Type ?? '');
    this.consumptionData.electric.totalReading =
      this.roundingService.roundToNearestInteger(data.TotalCurrentMonth ?? 0);
  }

  private setGasData(data: any): void {
    this.consumptionData.gas.percentage = data.Percentage ?? 0;
    this.consumptionData.gas.totalReading =
      this.roundingService.roundToNearestInteger(data.TotalCurrentMonth ?? 0);
  }

  private setWaterData(data: any): void {
    this.consumptionData.water.percentage = data.Percentage ?? 0;
    this.consumptionData.water.totalReading =
      this.roundingService.roundToNearestInteger(data.TotalCurrentMonth ?? 0);
  }
  ngOnDestroy() {
    // Clean up the subscription
    this.subscription.unsubscribe();
  }
}

interface ChartData {
  x: string; // Day of the week
  y: number; // Electricity consumption value
  fillColor: string; // Color for the data point
  date: string; // Date for the data point
  unit: string; // Unit for the data point
}
