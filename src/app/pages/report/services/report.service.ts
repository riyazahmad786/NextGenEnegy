import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ReportType } from '../../../core/models/types';
import { BaseService } from '../../../core/services/base.service';
import { SpinnerService } from '../../../core/services/spinner.service';
//const baseUrl = environment.baseUrl + 'report/';
const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root',
})
export class ReportService extends BaseService {
  private EleExpenses = new BehaviorSubject<any>(null);

  constructor(http: HttpClient, spinnerService: SpinnerService) {
    super(http, spinnerService);
  }

  getElectricityData(
    type: ReportType,
    facilityId: number,
    userId: number,
    locationId: number
  ): Observable<any> {
    const endpoint = `Get${type}EleConsumptions`;
    return this.getRequest(
      `${baseUrl}report/${endpoint}?FacilityID=${facilityId}&UserID=${userId}&LocationId=${locationId}`
    );
  }
  getElectricityExpensesData(
    type: ReportType,
    facilityId: number,
    userId: number,
    locationId: number
  ): Observable<any> {
    const endpoint = `GetEnergyExpenses${type}`;
    return this.getRequest(
      `${baseUrl}EnergyExpensesReport/${endpoint}?FacilityID=${facilityId}&UserID=${userId}&LocationId=${locationId}`
    );
  }
  getGasData(
    type: ReportType,
    facilityId: number,
    userId: number,
    locationId: number
  ): Observable<any> {
    const endpoint = `Get${type}GasConsumptions`;
    return this.getRequest(
      `${baseUrl}GasReport/${endpoint}?FacilityID=${facilityId}&UserID=${userId}&LocationId=${locationId}`
    );
  }
  getWaterData(
    type: ReportType,
    facilityId: number,
    userId: number,
    locationId: number
  ): Observable<any> {
    const endpoint = `Get${type}WaterConsumptions`;
    return this.getRequest(
      `${baseUrl}WaterReport/${endpoint}?FacilityID=${facilityId}&UserID=${userId}&LocationId=${locationId}`
    );
  }

  getSustainabilityData(
    type: ReportType,
    facilityId: number,
    userId: number,
    locationId: number
  ): Observable<any> {
    const endpoint = `Get${type}Emission`;
    return this.getRequest(
      `${baseUrl}SustainabilityReport/${endpoint}?FacilityID=${facilityId}&UserID=${userId}&LocationId=${locationId}`
    );
  }

  getTrendAndIntensityData(
    type: ReportType,
    facilityId: number,
    userId: number,
    locationId: number
  ): Observable<any> {
    const endpoint =
      type === 'MonthlyTrend'
        ? 'GetMonthlyTrendReport'
        : `Get${type}EnergyIntensity`;
    return this.getRequest(
      `${baseUrl}TrendIntensity/${endpoint}?FacilityID=${facilityId}&UserID=${userId}&LocationId=${locationId}`
    );
  }

  getPeakDemandData(
    type: ReportType,
    facilityId: number,
    userId: number,
    locationId: number
  ): Observable<any> {
    return this.getRequest(
      `${baseUrl}Report/GetMonthlyPeekDemand?FacilityID=${facilityId}&UserID=${userId}&LocationId=${locationId}`
    );
  }

  getElectricityAssetData(parameters: any): Observable<any> {
    const endpoint = `Get${parameters.type}AssetEnergyReport`;

    return this.getRequest(
      `${baseUrl}report/${endpoint}?BuildingID=${parameters.id.toString()}&UserID=${
        parameters.userId
      }&LocationId=${parameters.locationId}&FacilityID=${parameters.facilityId}`
    );
  }

  getGasAssetData(parameters: any): Observable<any> {
    const endpoint = `Get${parameters.type}AssetReport`;
    return this.getRequest(
      `${baseUrl}GasReport/${endpoint}?BuildingID=${parameters.id.toString()}&UserID=${
        parameters.userId
      }&LocationId=${parameters.locationId}&FacilityID=${parameters.facilityId}`
    );
  }

  getWaterAssetData(parameters: any): Observable<any> {
    const endpoint = `Get${parameters.type}AssetWaterReport`;
    return this.getRequest(
      `${baseUrl}WaterReport/${endpoint}?BuildingID=${parameters.id.toString()}&UserID=${
        parameters.userId
      }&LocationId=${parameters.locationId}&FacilityID=${parameters.facilityId}`
    );
  }

  sendReportEmail(EmailReport: any): Observable<any> {
    return this.postRequest(`${baseUrl}/Common/SendReportEmail`, EmailReport);
  }
}
