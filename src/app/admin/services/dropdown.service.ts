import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BaseService } from '../../core/services/base.service';
import { SpinnerService } from '../../core/services/spinner.service';
import {
  IAssetType,
  IAssetUnit,
  ICountry,
  IState,
  ITimeZones,
} from '../models/dropdown.module';

const baseUrl = environment.baseUrl + 'Admin/';
@Injectable({
  providedIn: 'root',
})
export class DropdownService extends BaseService {
  constructor(http: HttpClient, spinnerService: SpinnerService) {
    super(http, spinnerService);
  }

  getCountries(): Observable<ICountry[]> {
    return this.getRequest(`${baseUrl}GetCountries`);
  }

  getStates(id: any): Observable<IState[]> {
    return this.getRequest(`${baseUrl}GetStates?CountryID=${id}`);
  }

  getTimeZone(): Observable<ITimeZones[]> {
    return this.getRequest(`${baseUrl}GetTimeZone`);
  }

  getAssetTypes(
    userId: number,
    fid: number,
    lid: number
  ): Observable<IAssetType[]> {
    return this.getRequest(
      `${baseUrl}GetAssetsMappingDetails?UserID=${userId}&FacilityID=${fid}&LocationID=${lid}`
    );
  }

  getAssetUnits(id: any): Observable<IAssetUnit[]> {
    return this.getRequest(`${baseUrl}GetStates?CountryID=${id}`);
  }

  getFacilities(): Observable<any[]> {
    return this.getRequest(`${baseUrl}GetFacilitiesForDD`);
  }

  getBuildings(fid: any): Observable<any[]> {
    return this.getRequest(`${baseUrl}GetBuildingByFacility?FacilityID=${fid}`);
  }

  getFloors(bId: any): Observable<any[]> {
    return this.getRequest(`${baseUrl}GetFloorByBuilding?LocationID=${bId}`);
  }

  getMeter(facilityID: any, locationID: any, type: any): Observable<any[]> {
    return this.getRequest(
      `${baseUrl}GetMeterDetails?FacilityID=${facilityID}&SiteID=${locationID}&Type=${type}`
    );
  }
}
