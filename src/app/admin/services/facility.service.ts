import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BaseService } from '../../core/services/base.service';
import { SpinnerService } from '../../core/services/spinner.service';
import { AddFacility } from '../models/admin.model';

const baseUrl = environment.baseUrl + 'Admin/';

@Injectable({
  providedIn: 'root',
})
export class FacilityService extends BaseService {
  constructor(http: HttpClient, spinnerService: SpinnerService) {
    super(http, spinnerService);
  }

  addFacility(model: AddFacility): Observable<AddFacility> {
    return this.postRequest(`${baseUrl}SaveFacility`, model).pipe(
      catchError((error) => {
        console.error('Error in postDateRange:', error);
        throw error; // Throw the error further to handle in the component
      })
    );
  }

  updateFacility(model: AddFacility): Observable<AddFacility> {
    return this.postRequest(`${baseUrl}UpdateFacility`, model).pipe(
      catchError((error) => {
        console.error('Error in postDateRange:', error);
        throw error; // Throw the error further to handle in the component
      })
    );
  }

  getFacilityById(id: number): Observable<AddFacility> {
    return this.getRequest(`${baseUrl}GetFacilityById?FacilityID=${id}`).pipe(
      catchError((error) => {
        console.error('Error in postDateRange:', error);
        throw error;
      })
    );
  }

  getFacilities(): Observable<AddFacility[]> {
    return this.getRequest(`${baseUrl}GetFacilitiesForDD`).pipe(
      catchError((error) => {
        console.error('Error in postDateRange:', error);
        throw error;
      })
    );
  }
  DeleteFacilityById(id: number): Observable<AddFacility> {
    return this.getRequest(`${baseUrl}DeleteFacility?FacilityID=${id}`).pipe(
      catchError((error) => {
        console.error('Error in postDateRange:', error);
        throw error;
      })
    );
  }
}
