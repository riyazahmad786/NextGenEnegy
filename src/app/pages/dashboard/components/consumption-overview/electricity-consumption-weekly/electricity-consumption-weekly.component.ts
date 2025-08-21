import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Facility } from '../../../../../core/models/facility';
import { CompactNumberPipe } from '../../../../../shared/pipes/compact-number.pipe';
import { RemoveNegativeSignPipe } from '../../../../../shared/pipes/remove-negative-sign.pipe';
import { FacilityCommunicationService } from '../../../services/facility-communication.service';
import { FacilityDashboardService } from '../../../services/facility-dashboard.service';
import { ElectricityConsumptionWeeklyChartComponent } from './electricity-consumption-weekly-chart/electricity-consumption-weekly-chart.component';

@Component({
  selector: 'app-electricity-consumption-weekly',
  standalone: true,
  imports: [
    ElectricityConsumptionWeeklyChartComponent,
    CompactNumberPipe,
    CommonModule,
    RemoveNegativeSignPipe,
  ],
  templateUrl: './electricity-consumption-weekly.component.html',
  styleUrl: './electricity-consumption-weekly.component.css',
})
export class ElectricityConsumptionWeeklyComponent {
  @Input() facilitiesData?: Facility;
  facility?: Facility;
  TotalReading: number = 0;
  Percentage: number = 0;
  constructor(
    private facilityService: FacilityDashboardService,
    private communicationService: FacilityCommunicationService
  ) {}

  ngOnInit() {
    this.communicationService.reloadChart$.subscribe(({ fid, userID }) => {
      this.loadConsumptionTotal(fid!, 'Electric');
    });
    this.facility = this.facilitiesData;
    this.loadConsumptionTotal(this.facilitiesData?.FacilitiesID!, 'Electric');
  }
  loadConsumptionTotal(fid: number, AssetsType: string) {
    this.facilityService.GetTotalConsumptions(fid, AssetsType).subscribe(
      (data: any) => {
        const getData = (data as any).Table;
        console.log(getData);
        this.Percentage = getData[0].Percentage;
        this.TotalReading = getData[0].TotalReading;
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }
}
