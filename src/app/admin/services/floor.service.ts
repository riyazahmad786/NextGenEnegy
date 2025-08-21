import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BaseService } from '../../core/services/base.service';
import { SpinnerService } from '../../core/services/spinner.service';
import { AddFloor } from '../models/admin.model';
const baseUrl = environment.baseUrl + 'Admin/';
@Injectable({
  providedIn: 'root',
})
export class FloorService extends BaseService {
  constructor(http: HttpClient, spinnerService: SpinnerService) {
    super(http, spinnerService);
  }

  addFloor(model: AddFloor): Observable<AddFloor> {
    return this.postRequest(`${baseUrl}SaveFloor`, model).pipe(
      catchError((error) => {
        console.error('Error in add Building:', error);
        throw error; // Throw the error further to handle in the component
      })
    );
  }

  updateFloor(model: AddFloor): Observable<AddFloor> {
    return this.postRequest(`${baseUrl}UpdateFloor`, model).pipe(
      catchError((error) => {
        console.error('Error in update Building:', error);
        throw error; // Throw the error further to handle in the component
      })
    );
  }

  getFloorById(id: number): Observable<AddFloor> {
    return this.getRequest(`${baseUrl}GetFloorById?LocationID=${id}`).pipe(
      catchError((error) => {
        console.error('Error in get floor By Id:', error);
        throw error;
      })
    );
  }

  getFloors(PLIds: string): Observable<AddFloor[]> {
    return this.getRequest(
      `${baseUrl}GetFloorByBuilding?LocationID=${PLIds}`
    ).pipe(
      catchError((error) => {
        console.error('Error in postDateRange:', error);
        throw error;
      })
    );
  }
  DeletefloorById(id: number, Pid: number): Observable<AddFloor> {
    return this.getRequest(
      `${baseUrl}Deletefloor?LocationID=${id}&ParentLocationID=${Pid}`
    ).pipe(
      catchError((error) => {
        console.error('Error in deleting Floor:', error);
        throw error;
      })
    );
  }
}
