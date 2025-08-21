import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import {
  ConsumptionData,
  defaultConsumptionData,
} from '../../../../core/models/consumption-data.model';
import { Facility } from '../../../../core/models/facility';
import { mapToElectricityData } from '../../../../core/utils/chart-utils';
import { AppState } from '../../../../core/utils/report-types-utils';
import { RoundingService } from '../../../../core/utils/rounding.service';
import { ConsumptionsOverviewChartComponent } from '../../../../shared/high-charts/consumptions-overview-chart/consumptions-overview-chart.component';
import { CompactNumberPipe } from '../../../../shared/pipes/compact-number.pipe';
import { RemoveNegativeSignPipe } from '../../../../shared/pipes/remove-negative-sign.pipe';
import { RoundingPipe } from '../../../../shared/pipes/rounding.pipe';
import { AppStateService } from '../../../../shared/service/app-state.service';
import { WeatherComponent } from '../../../weather/weather.component';
import { FacilityCommunicationService } from '../../services/facility-communication.service';
import { FacilityDashboardService } from '../../services/facility-dashboard.service';

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
export class ConsumptionOverviewComponent implements OnInit, OnDestroy {
  @Input() facilitiesData?: Facility;
  private destroy$ = new Subject<void>();
  facility?: Facility;
  facilityId?: number;
  userId?: number;

  consumptionData: ConsumptionData = { ...defaultConsumptionData };

  constructor(
    private facilityService: FacilityDashboardService,
    private communicationService: FacilityCommunicationService,
    private appState: AppStateService,
    private roundingService: RoundingService
  ) {
    this.userId = this.appState.getParameter(AppState.UserId);
    this.facilityId = this.facilitiesData?.FacilitiesID;
  }

  ngOnInit() {
    this.communicationService.reloadChart$.subscribe(({ fid, userID }) => {
      this.facilityId = fid;
      this.loadConsumptionData(fid!, this.userId!);
    });

    this.facility = this.facilitiesData;
    this.facilityId = this.facilitiesData?.FacilitiesID;
    this.loadConsumptionData(this.facilitiesData?.FacilitiesID!, this.userId!);
  }

  loadConsumptionData(facilityId: number, userId: number) {
    this.loadUtilityData('Electricity', facilityId, userId);
    this.loadUtilityData('Gas', facilityId, userId);
    this.loadUtilityData('Water', facilityId, userId);

    this.loadTotalConsumption(facilityId, 'Electric' as keyof ConsumptionData);
    this.loadTotalConsumption(facilityId, 'Gas' as keyof ConsumptionData);
    this.loadTotalConsumption(facilityId, 'Water' as keyof ConsumptionData);
  }

  loadUtilityData(
    type: 'Electricity' | 'Gas' | 'Water',
    facilityId: number,
    userId: number
  ): void {
    const serviceMethodMap = {
      Electricity: this.facilityService.GetElectricityConsumptionWeekly,
      Gas: this.facilityService.GetGasConsumptionWeekly,
      Water: this.facilityService.GetWaterConsumptionWeekly,
    };
    serviceMethodMap[type]
      .call(this.facilityService, facilityId, userId)
      .subscribe(
        (data: any[]) => {
          const response = (data as any).Table;
          const types = type;
          const condition = types === 'Electricity' ? 'electric' : type;
          this.consumptionData[
            condition.toLowerCase() as keyof ConsumptionData
          ].chartData = response.map(mapToElectricityData);
        },
        (error) => {
          console.error(`Error fetching total consumption for `, error);
        }
      );
  }

  loadTotalConsumption(
    facilityId: number,
    assetType: keyof ConsumptionData
  ): void {
    this.facilityService.GetTotalConsumptions(facilityId, assetType).subscribe(
      (data: any) => {
        const consumptionData = (data as any).Table[0];
        this.setConsumptionData(assetType, consumptionData);
      },
      (error) => {
        console.error(
          `Error fetching total consumption for ${assetType}:`,
          error
        );
      }
    );
  }
  private setConsumptionData(assetType: string, data: any): void {
    const assetKey = assetType.toLowerCase() as keyof ConsumptionData;
    if (this.consumptionData.hasOwnProperty(assetKey)) {
      this.consumptionData[assetKey].percentage = data.Percentage;
      this.consumptionData[assetKey].totalReading =
        this.roundingService.roundToNearestInteger(data.TotalCurrentMonth ?? 0);
    } else {
      console.error(`Invalid assetType: ${assetType}`);
    }
  }

  ngOnDestroy() {
    // Cleanup
    this.destroy$.next();
    this.destroy$.complete();
  }
}
