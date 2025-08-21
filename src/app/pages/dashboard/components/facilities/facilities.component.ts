import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Facility, LocationModel } from '../../../../core/models/facility';
import { SpinnerService } from '../../../../core/services/spinner.service';
import { StorageService } from '../../../../core/services/storage.service';
import { AppState } from '../../../../core/utils/report-types-utils';
import { AppStateService } from '../../../../shared/service/app-state.service';
import { PropertyService } from '../../../../shared/service/property.service';
import { SpinnerComponent } from '../../../../shared/spinner/spinner.component';
import { WeatherService } from '../../../weather/services/weather.service';
import { FacilityCommunicationService } from '../../services/facility-communication.service';
import { FacilityDashboardService } from '../../services/facility-dashboard.service';
import { FacilityConsumptionExpensesComponent } from '../facility-consumption-expenses/facility-consumption-expenses.component';
import { GoogleMapComponent } from '../google-map/google-map.component';
import { LocationService } from '../google-map/services/location.service';

@Component({
  selector: 'app-facilities',
  standalone: true,
  imports: [
    GoogleMapComponent,
 
    // FacilityColumnChartComponent,
 
    SpinnerComponent,
    CommonModule,
    FacilityConsumptionExpensesComponent,
  ],
  templateUrl: './facilities.component.html',
  styleUrl: './facilities.component.css',
})
export class FacilitiesComponent implements OnInit {
  @Output() dataEvent = new EventEmitter<Facility>();
  loading$!: Observable<boolean>;

  facilities: Facility[] = [];
  facilitiesData?: Facility;
  facility?: Facility;
  buildings: Location[] = [];
  selectedIndex?: number;

  constructor(
    private propertyService: PropertyService,
    private facilityService: FacilityDashboardService,
    private locationService: LocationService,
    private spinnerService: SpinnerService,
    private weatherService: WeatherService,
    private communicationService: FacilityCommunicationService,
    private storagesService: StorageService,
    private appState: AppStateService
  ) {}
  ngOnInit(): void {
    this.loading$ = this.spinnerService.loading$;

    this.loadFacilities(this.storagesService.getUserId());
  }

  private loadFacilities(userId: number): void {
    this.facilityService.getFacilities(userId).subscribe(
      (data: any) => {
        this.facilities = data.Table as Facility[];
        this.handleFirstFacilitySelection();
      },
      (error) => console.error('Error fetching facilities:', error)
    );
  }

  private handleFirstFacilitySelection(): void {
    if (this.facilities.length > 0) {
      const firstFacility = this.facilities[0];
      this.selectFacility(0, firstFacility);
    }
  }

  selectFacility(index: number, facility: Facility): void {
    this.facility = facility;
    this.updateFacilityData(index, facility);
    this.communicationService.emitReloadChart(facility.FacilitiesID, 1);
  }

  private updateFacilityData(index: number, facility: Facility): void {
    this.appState.addParameter(AppState.FacilityName, facility.FacilityName);
    this.appState.addParameter(AppState.FacilityId, facility.FacilitiesID);
    this.appState.addParameter(AppState.FTimezone, facility.FTimezone);
    this.dataEvent.emit(facility);
    this.selectedIndex = index;
    this.facilitiesData = facility;
    this.facilityService.GetDashboardEleExpenses(1, facility.FacilitiesID);
    this.loadBuildings(facility.FacilitiesID);
    this.weatherService.getWeather(
      facility.Latitud,
      facility.Longitude,
      facility.FacilityName,
      0
    );
  }

  private loadBuildings(faciId: number): void {
    this.facilityService.getBuildings(faciId, 1).subscribe(
      (data: any) => {
        this.buildings = data.Table as Location[];
        this.updateLocationService();
      },
      (error) => console.error('Error fetching buildings:', error)
    );
  }

  private updateLocationService(): void {
    const mappedPairs = this.mapToLatLngPairs(this.buildings, 'building');
    if (mappedPairs.length > 0) {
      this.locationService.updateLatLngPairs(mappedPairs);
    }
  }

  private mapToLatLngPairs(data: any[], type: string): any[] {
    return data.map((item) => this.mapItemToLatLngPair(item, type));
  }

  private mapItemToLatLngPair(item: any, type: string): any {
    if (type === 'building') {
      return this.mapBuildingItem(item);
    } else {
      return this.mapFacilityItem(item);
    }
  }

  private mapBuildingItem(item: LocationModel): any {
    return {
      Latitud: item.Latitud,
      Longitude: item.Longitude,
      Name: item.LocationName,
      City: item.City,
      BuildingAvailable: item.BuildingAvailable,
      FacilityID: item.FacilityID,
      LocationID: item.LocationID,
      SiteID: item.SiteID,
    };
  }

  private mapFacilityItem(item: LocationModel): any {
    return {
      Latitud: item.Latitud,
      Longitude: item.Longitude,
      Name: item.LocationName,
      FacilityName: item.City,
      BuildingAvailable: item.BuildingAvailable,
      SiteID: item.SiteID,
    };
  }
}
