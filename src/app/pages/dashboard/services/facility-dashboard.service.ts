import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../../../environments/environment';
import { Facility } from '../../../core/models/facility';
import { BaseService } from '../../../core/services/base.service';
import { SpinnerService } from '../../../core/services/spinner.service';

const baseUrl = environment.baseUrl + 'Dashboard/';

@Injectable({
  providedIn: 'root',
})
export class FacilityDashboardService extends BaseService {
  private EleExpenses = new BehaviorSubject<any>(null);

  constructor(http: HttpClient, spinnerService: SpinnerService) {
    super(http, spinnerService);
  }

  getFacilities(id: any): Observable<Facility[]> {
    return this.getRequest(`${baseUrl}GetfacilityData?UserID=${id}`);
  }

  getBuildings(fid: any, id: any): Observable<Facility[]> {
    return this.getRequest(
      `${baseUrl}GetUpdatedSiteDetails?FacilityID=${fid}&UserID=${id}`
    );
  }

  GetDashboardEleExpenses(fid: number, UserID: number): Observable<any[]> {
    return this.getRequest(
      `${baseUrl}GetDashboardEleExpenses?FacilityID=${fid}&UserID=${UserID}`
    );
  }

  GetDashboardEleConsumption(fid: number, UserID: number): Observable<any[]> {
    return this.getRequest(
      `${baseUrl}GetDashboardEleConsumptions?FacilityID=${fid}&UserID=${UserID}`
    );
  }

  GetElectricityConsumptionWeekly(
    fid: number,
    UserID: number
  ): Observable<any[]> {
    return this.getRequest(
      `${baseUrl}GetElectricityWeeklyConsumptions?FacilityID=${fid}&UserID=${UserID}`
    );
  }

  GetGasConsumptionWeekly(fid: number, UserID: number): Observable<any[]> {
    return this.getRequest(
      `${baseUrl}GetGasWeeklyConsumptions?FacilityID=${fid}&UserID=${UserID}`
    );
  }

  GetWaterConsumptionWeekly(fid: number, UserID: number): Observable<any[]> {
    return this.getRequest(
      `${baseUrl}GetWaterWeeklyConsumptions?FacilityID=${fid}&UserID=${UserID}`
    );
  }

  GetTotalConsumptions(fid: number, AssetsType: string): Observable<any[]> {
    return this.getRequest(
      `${baseUrl}GetTotalConsumptions?FacilityID=${fid}&AssetsType=${AssetsType}`
    );
  }
}
