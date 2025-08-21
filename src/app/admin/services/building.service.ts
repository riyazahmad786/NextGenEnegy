import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BaseService } from '../../core/services/base.service';
import { SpinnerService } from '../../core/services/spinner.service';
import { AddBuildings } from '../models/admin.model';
const baseUrl = environment.baseUrl + 'Admin/';
@Injectable({
  providedIn: 'root',
})
export class BuildingService extends BaseService {
  constructor(http: HttpClient, spinnerService: SpinnerService) {
    super(http, spinnerService);
  }

  addBuilding(model: AddBuildings): Observable<AddBuildings> {
    return this.postRequest(`${baseUrl}SaveBuilding`, model).pipe(
      catchError((error) => {
        console.error('Error in add Building:', error);
        throw error; // Throw the error further to handle in the component
      })
    );
  }

  updateBuilding(model: AddBuildings): Observable<AddBuildings> {
    return this.postRequest(`${baseUrl}UpdateBuilding`, model).pipe(
      catchError((error) => {
        console.error('Error in update Building:', error);
        throw error; // Throw the error further to handle in the component
      })
    );
  }

  getBuildingById(id: number): Observable<AddBuildings> {
    return this.getRequest(`${baseUrl}GetBuildingById?LocationID=${id}`).pipe(
      catchError((error) => {
        console.error('Error in get Building By Id:', error);
        throw error;
      })
    );
  }

  getBuildings(FacilityIds: string): Observable<AddBuildings[]> {
    return this.getRequest(
      `${baseUrl}GetBuildings?FacilityIds=${FacilityIds}`
    ).pipe(
      catchError((error) => {
        console.error('Error in postDateRange:', error);
        throw error;
      })
    );
  }
  DeleteBuildingById(id: number, Pid: number): Observable<AddBuildings> {
    return this.getRequest(
      `${baseUrl}DeleteBuilding?LocationID=${id}&ParentLocationID=${Pid}`
    ).pipe(
      catchError((error) => {
        console.error('Error in deleting building:', error);
        throw error;
      })
    );
  }
}
