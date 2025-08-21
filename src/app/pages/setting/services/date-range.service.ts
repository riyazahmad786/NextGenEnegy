import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { BaseService } from '../../../core/services/base.service';
import { SpinnerService } from '../../../core/services/spinner.service';
import { DateRangeWithSiteModel } from '../models/setting';

const baseUrl = environment.baseUrl + 'Setting/';

@Injectable({
  providedIn: 'root',
})
export class DateRangeService extends BaseService {
  constructor(http: HttpClient, spinnerService: SpinnerService) {
    super(http, spinnerService);
  }

  // postDateRange(
  //   rangeDate: DateRangeWithSiteModel
  // ): Observable<DateRangeWithSiteModel> {
  //   return this.postRequest(`${baseUrl}DashboardReportDate`, model);
  // }

  postDateRange(
    model: DateRangeWithSiteModel
  ): Observable<DateRangeWithSiteModel> {
    return this.postRequest(`${baseUrl}DashboardReportDate`, model).pipe(
      catchError((error) => {
        console.error('Error in postDateRange:', error);
        throw error; // Throw the error further to handle in the component
      })
    );
  }

  getDateRange(id: any, SideID: any): Observable<any[]> {
    return this.getRequest(
      `${baseUrl}DashboardReportGetDate?UserId=${id}&SideID=${SideID}`
    );
  }

  getFilteredAssetsByUser(
    FacilityID: number,
    SiteID: number,
    UserID: number
  ): Observable<any> {
    return this.getRequest(
      `${baseUrl}GetFilteredAssetsByUser?FacilityID=${FacilityID}&SiteID=${SiteID}&UserID=${UserID}`
    );
  }
}
