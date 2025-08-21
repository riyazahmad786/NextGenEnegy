import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BaseService } from '../../core/services/base.service';
import { SpinnerService } from '../../core/services/spinner.service';
import { AddAsset } from '../models/admin.model';

//import { DeviceDetails, DeviceObjects } from '../models/admin.model';
import { ExcelDeviceRow } from '../models/admin.model';

const baseUrl = environment.baseUrl + 'Admin/';
const baseUrl1 = environment.baseUrl + 'SaveBACnetPoints/';
@Injectable({
  providedIn: 'root',
})
export class AssetService extends BaseService {
  constructor(http: HttpClient, spinnerService: SpinnerService) {
    super(http, spinnerService);
  }

  addAsset(model: AddAsset): Observable<AddAsset> {
    return this.postRequest(
      `${baseUrl}SaveAssetAndMeterMappingNew`,
      model
    ).pipe(
      catchError((error) => {
        console.error('Error in add Building:', error);
        throw error; // Throw the error further to handle in the component
      })
    );
  }

  updateAsset(model: AddAsset): Observable<AddAsset> {
    return this.postRequest(`${baseUrl}UpdateAssetAndMappingNew`, model).pipe(
      catchError((error) => {
        console.error('Error in update Building:', error);
        throw error; // Throw the error further to handle in the component
      })
    );
  }

  getAssetById(id: number): Observable<AddAsset> {
    return this.getRequest(`${baseUrl}GetBuildingById?LocationID=${id}`).pipe(
      catchError((error) => {
        console.error('Error in get Building By Id:', error);
        throw error;
      })
    );
  }

  getAssets(FacilityIds: string, LocationId: string): Observable<AddAsset[]> {
    return this.getRequest(
      `${baseUrl}GetAssetByFLid?FacilityIds=${FacilityIds}&LocationId=${LocationId}`
    ).pipe(
      catchError((error) => {
        console.error('Error in postDateRange:', error);
        throw error;
      })
    );
  }

  //Swati changes
  getBACnetDevices(facilityId: number): Observable<ExcelDeviceRow[]> {
    return this.getRequest(
      `${baseUrl1}GetBACnetDevice?FacilityID=${facilityId}`
    ).pipe(
      catchError((error) => {
        console.error('Error fetching BACnet devices:', error);
        throw error;
      })
    );
  }

  //Swati changes
  getBACnetObjects(
    BACnetDeviceID: number,
    facilityId: number
  ): Observable<ExcelDeviceRow[]> {
    return this.getRequest(
      `${baseUrl1}GetBACnetObjectsDetails?bacnetDeviceID=${BACnetDeviceID}&FacilityID=${facilityId}`
    ).pipe(
      catchError((error) => {
        console.error('Error fetching BACnet objects:', error);
        throw error;
      })
    );
  }

  DeleteAssetById(AssetID: number): Observable<AddAsset> {
    return this.getRequest(
      `${baseUrl}DeleteAssetAndMeterMapping?AssetID=${AssetID}`
    ).pipe(
      catchError((error) => {
        console.error('Error in postDateRange:', error);
        throw error;
      })
    );
  }
}
