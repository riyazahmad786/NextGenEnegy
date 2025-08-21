import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BaseService } from '../../core/services/base.service';
import { SpinnerService } from '../../core/services/spinner.service';
import { ExcelDeviceRow } from '../models/admin.model';
const baseUrl = environment.baseUrl + 'Admin/';

interface ExcelRow {
  MeterID: string | number;
  Reading: number;
  Date: string;
  Type: string;
}
interface MeterReadingUpload {
  UserID: number;
  Readings: ExcelRow[];
}

interface DeviceReadingUpload {
  FacilityName: String;
  deviceInfos: ExcelDeviceRow[];
}

@Injectable({
  providedIn: 'root',
})
export class ReadingSourceService extends BaseService {
  constructor(http: HttpClient, spinnerService: SpinnerService) {
    super(http, spinnerService);
  }

  bulkUpload(data: ExcelRow[], userId: number): Observable<any> {
    const payload: MeterReadingUpload = {
      UserID: userId, // replace with actual userId
      Readings: data, // this is ExcelRow[]
    };
    return this.postRequest(`${baseUrl}BulkAssetExcell`, payload).pipe(
      catchError((error) => {
        console.error('Error in bulk upload:', error);
        throw error;
      })
    );
  }

  BacnetFileUpload(
    deviceInfos: ExcelDeviceRow[],
    FacilityName: string
  ): Observable<any> {
    const payload: DeviceReadingUpload = {
      FacilityName: FacilityName, // replace with actual userId
      deviceInfos: deviceInfos, // this is ExcelRow[]
    };
    return this.postRequest(
      `${environment.baseUrl}SaveBACnetPoints/SaveDevicesInformationFromCSV`,
      payload
    ).pipe(
      catchError((error) => {
        console.error('Error in bulk upload:', error);
        throw error;
      })
    );
  }
}
