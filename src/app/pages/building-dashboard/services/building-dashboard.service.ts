import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { BaseService } from '../../../core/services/base.service';
import { SpinnerService } from '../../../core/services/spinner.service';

const baseUrl = environment.baseUrl + 'Location/';
@Injectable({
  providedIn: 'root',
})
export class BuildingDashboardService extends BaseService {
  private EleExpenses = new BehaviorSubject<any>(null);

  constructor(http: HttpClient, spinnerService: SpinnerService) {
    super(http, spinnerService);
  }
  getBuildings(fid: any, id: any, locationId: number): Observable<any[]> {
    return this.getRequest(
      `${baseUrl}GetUpdatedSiteDetails?FacilityID=${fid}&UserID=${id}&LocationId=${locationId}`
    );
  }

  GetDailyElectricityConsumption(
    fid: number,
    UserID: number,
    locationId: number
  ): Observable<any[]> {
    return this.getRequest(
      `${baseUrl}GetDailyEleConsumptions?FacilityID=${fid}&UserID=${UserID}&LocationID=${locationId}`
    );
  }

  GetMonthlyElectricityExpenses(
    fid: number,
    UserID: number,
    locationId: number
  ): Observable<any[]> {
    return this.getRequest(
      `${baseUrl}GetMonthlyEleExpenses?FacilityID=${fid}&UserID=${UserID}&LocationID=${locationId}`
    );
  }

  GetMonthlyElectricityConsumption(
    fid: number,
    UserID: number,
    locationId: number
  ): Observable<any[]> {
    return this.getRequest(
      `${baseUrl}GetMonthlyEleConsumptions?FacilityID=${fid}&UserID=${UserID}&LocationID=${locationId}`
    );
  }

  GetWeeklyElectricityConsumption(
    fid: number,
    UserID: number,
    locationId: number
  ): Observable<any[]> {
    return this.getRequest(
      `${baseUrl}GetWeeklyElectricityConsumptions?FacilityID=${fid}&UserID=${UserID}&LocationID=${locationId}`
    );
  }

  GetDailyGasConsumption(
    fid: number,
    UserID: number,
    locationId: number
  ): Observable<any[]> {
    return this.getRequest(
      `${baseUrl}GetDailyGasConsumptions?FacilityID=${fid}&UserID=${UserID}&LocationID=${locationId}`
    );
  }

  GetMonthlyGasExpenses(
    fid: number,
    UserID: number,
    locationId: number
  ): Observable<any[]> {
    return this.getRequest(
      `${baseUrl}GetMonthlyGasExpenses?FacilityID=${fid}&UserID=${UserID}&LocationID=${locationId}`
    );
  }

  GetMonthlyGasConsumption(
    fid: number,
    UserID: number,
    locationId: number
  ): Observable<any[]> {
    return this.getRequest(
      `${baseUrl}GetMonthlyGasConsumptions?FacilityID=${fid}&UserID=${UserID}&LocationID=${locationId}`
    );
  }

  GetWeeklyGasConsumption(
    fid: number,
    UserID: number,
    locationId: number
  ): Observable<any[]> {
    return this.getRequest(
      `${baseUrl}GetWeeklyGasConsumptions?FacilityID=${fid}&UserID=${UserID}&LocationID=${locationId}`
    );
  }

  GetDailyWaterConsumption(
    fid: number,
    UserID: number,
    locationId: number
  ): Observable<any[]> {
    return this.getRequest(
      `${baseUrl}GetDailyWaterConsumptions?FacilityID=${fid}&UserID=${UserID}&LocationID=${locationId}`
    );
  }

  GetMonthlyWaterExpenses(
    fid: number,
    UserID: number,
    locationId: number
  ): Observable<any[]> {
    return this.getRequest(
      `${baseUrl}GetMonthlyWaterExpenses?FacilityID=${fid}&UserID=${UserID}&LocationID=${locationId}`
    );
  }

  GetMonthlyWaterConsumption(
    fid: number,
    UserID: number,
    locationId: number
  ): Observable<any[]> {
    return this.getRequest(
      `${baseUrl}GetMonthlyWaterConsumptions?FacilityID=${fid}&UserID=${UserID}&LocationID=${locationId}`
    );
  }
  GetWeeklyWaterConsumption(
    fid: number,
    UserID: number,
    locationId: number
  ): Observable<any[]> {
    return this.getRequest(
      `${baseUrl}GetWeeklyWaterConsumptions?FacilityID=${fid}&UserID=${UserID}&LocationID=${locationId}`
    );
  }

  GetDailyIntensityReport(
    fid: number,
    UserID: number,
    locationId: number
  ): Observable<any[]> {
    return this.getRequest(
      `${baseUrl}GetDailyEnergyIntensity?FacilityID=${fid}&UserID=${UserID}&LocationID=${locationId}`
    );
  }

  GetMonthlyTrendReport(
    fid: number,
    UserID: number,
    locationId: number
  ): Observable<any[]> {
    return this.getRequest(
      `${baseUrl}GetMonthlyTrendReport?FacilityID=${fid}&UserID=${UserID}&LocationID=${locationId}`
    );
  }

  GetMonthlyIntensityReport(
    fid: number,
    UserID: number,
    locationId: number
  ): Observable<any[]> {
    return this.getRequest(
      `${baseUrl}GetMonthlyEnergyIntensity?FacilityID=${fid}&UserID=${UserID}&LocationID=${locationId}`
    );
  }

  GetSustainabilityGHGEmission(
    fid: number,
    UserID: number,
    locationId: number
  ): Observable<any[]> {
    return this.getRequest(
      `${baseUrl}GetSustainabilityGHGEmission?FacilityID=${fid}&UserID=${UserID}&LocationID=${locationId}`
    );
  }

  GetMonthlyPeekDemand(
    fid: number,
    UserID: number,
    locationId: number
  ): Observable<any[]> {
    return this.getRequest(
      `${baseUrl}GetMonthlyPeekDemand?FacilityID=${fid}&UserID=${UserID}&LocationID=${locationId}`
    );
  }

  GetElectricityExpenses(
    fid: number,
    UserID: number,
    locationId: number
  ): Observable<any[]> {
    return this.getRequest(
      `${baseUrl}GetMonthlyEnergyExpenses?FacilityID=${fid}&UserID=${UserID}&LocationID=${locationId}`
    );
  }

  GetDailySustainabilityConsumption(
    fid: number,
    UserID: number,
    locationId: number
  ): Observable<any[]> {
    return this.getRequest(
      `${baseUrl}GetDailyCoEmmision?FacilityID=${fid}&UserID=${UserID}&LocationID=${locationId}`
    );
  }
  GetTotalConsumptions(
    fid: number,
    UserID: number,
    AssetsType: string,
    locationId: number
  ): Observable<any[]> {
    return this.getRequest(
      `${baseUrl}GetTotalConsumptions?FacilityID=${fid}&AssetsType=${AssetsType}&LocationID=${locationId}`
    );
  }
  GetsetSettingDetails(
    ReportType: string,
    userId: number,
    locationId: number
  ): Observable<any[]> {
    return this.getRequest(
      `${baseUrl}setSettingDetails?ReportType=${ReportType}&userId=${userId}&locationId=${locationId}`
    );
  }
}
