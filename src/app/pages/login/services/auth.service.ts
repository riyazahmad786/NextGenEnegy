import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
//import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.baseUrl;
  private username: string | null = null;

  constructor(private http: HttpClient) {}

  setUsername(username: string) {
    this.username = username;
    localStorage.setItem('username', username);
  }

  getUsername(): string | null {
    if (!this.username) {
      this.username = localStorage.getItem('username');
    }
    return this.username;
  }
  login(username: string, password: string): Promise<any> {
    const headers = { 'Content-Type': 'application/json' };
    const login = { Username: username, password: password };

    return this.http
      .post(`${this.apiUrl}/Common/LoginEnergyNewUI`, login, { headers })
      .pipe(catchError(this.handleError))
      .toPromise();
  }
  addUser(username: string, password: string) {
    const headers = { 'Content-Type': 'application/json' };
    let url = environment.baseUrl + '/Common/LoginEnergy ';
    this.http
      .post(
        url,
        {
          Username: username,
          password: password,
        },
        { headers }
      )
      .toPromise()
      .then((data: any) => {
        console.log(data);
      });
  }
  sendPassword(username: string): Promise<any> {
    const headers = { 'Content-Type': 'application/json' };
    const payload = { Username: username };

    return this.http
      .post(`${this.apiUrl}/Common/ForgotPassword`, payload, { headers })
      .pipe(catchError(this.handleError))
      .toPromise();
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: ${error.error}`
      );
    }
    return throwError('Something bad happened; please try again later.');
  }
}
