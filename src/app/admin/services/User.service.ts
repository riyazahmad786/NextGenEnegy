import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BaseService } from '../../core/services/base.service';
import { SpinnerService } from '../../core/services/spinner.service';

const baseUrl = environment.baseUrl + 'Admin/';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseService {
  constructor(http: HttpClient, spinnerService: SpinnerService) {
    super(http, spinnerService);
  }

  saveUser(userData: any): Observable<any> {
    return this.postRequest(`${baseUrl}SaveUser`, userData);
  }

  updateUser(userId: number, userData: any): Observable<any> {
    return this.postRequest(`${baseUrl}UpdateUser`, {
      ...userData,
      UserID: userId,
    });
  }

  getUserById(userId: number): Observable<any> {
    return this.getRequest(`${baseUrl}GetUserById?UserID=${userId}`);
  }

  getUsers(): Observable<any> {
    return this.getRequest(`${baseUrl}GetUser`);
  }

  deleteUser(userId: number): Observable<any> {
    return this.getRequest(`${baseUrl}DeleteUser?UserID=${userId}`);
  }
  getFacilities(userId: number): Observable<any> {
    return this.getRequest(`${baseUrl}GetfacilityData?UserID=${userId}`);
  }
  getUserRole(userId: number): Observable<any> {
    return this.getRequest(`${baseUrl}GetUserAdmin?UserID=${userId}`);
  }
}
