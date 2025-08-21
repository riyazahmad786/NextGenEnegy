import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { BaseService } from '../../../core/services/base.service';
import { SpinnerService } from '../../../core/services/spinner.service';
import { ScheduleModel } from '../models/setting';

const baseUrls = environment.baseUrl + 'Dashboard/';

@Injectable({
  providedIn: 'root',
})
export class SchedulerService extends BaseService {
  constructor(http: HttpClient, spinnerService: SpinnerService) {
    super(http, spinnerService);
  }

  getSchedule(
    UserID: number,
    SiteID: number,
    FacilityID: number
  ): Observable<ScheduleModel> {
    return this.getRequest(
      `${baseUrls}GetUser?UserID=${UserID}&SiteID=${SiteID}&FacilityID=${FacilityID}`
    );
  }

  saveSchedule(scheduleModel: ScheduleModel): Observable<any> {
    //return this.http.post(`${baseUrl}SetRShedule`, scheduleModel);
    return this.postRequest(`${baseUrls}SetRShedule`, scheduleModel);
  }

  logScheduleData(scheduleModel: ScheduleModel): void {
    console.log('Schedule Data:', scheduleModel);
  }
}
