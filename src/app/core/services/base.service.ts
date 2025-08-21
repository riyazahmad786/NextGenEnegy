import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { SpinnerService } from './spinner.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class BaseService {
  constructor(
    private http: HttpClient,
    private spinnerService: SpinnerService
  ) {}

  // Function to generate HTTP headers, including the authorization token
  private getHttpOptions(): any {
    // Define and return HTTP options here (e.g., headers)
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
  }

  protected getRequest(url: string): Observable<any> {
    this.spinnerService.show();
    return this.http.get(url, this.getHttpOptions()).pipe(
      catchError(this.handleError),
      finalize(() => this.spinnerService.hide())
    );
  }

  protected getRequestDDl<T>(url: string): Observable<T> {
    this.spinnerService.show();
    return this.http
      .get<T>(url)
      .pipe(finalize(() => this.spinnerService.hide()));
  }

  protected postRequest(url: string, data: any): Observable<any> {
    this.spinnerService.show();
    //const JsonData = JSON.stringify(data);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(url, data, { headers }).pipe(
      catchError(this.handleError),
      finalize(() => this.spinnerService.hide())
    );
  }

  protected postRequestFile(url: string, data: any): Observable<any> {
    this.spinnerService.show();
    const JsonData = JSON.stringify(data);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(url, JsonData, { headers }).pipe(
      catchError(this.handleError),
      finalize(() => this.spinnerService.hide())
    );
  }

  protected deleteRequest(url: string): Observable<any> {
    this.spinnerService.show();
    return this.http.delete(url, this.getHttpOptions()).pipe(
      catchError(this.handleError),
      finalize(() => this.spinnerService.hide())
    );
  }

  protected putRequest(url: string, data: any): Observable<any> {
    this.spinnerService.show();
    return this.http.put(url, data, this.getHttpOptions()).pipe(
      catchError(this.handleError),
      finalize(() => this.spinnerService.hide())
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }

    // Return an observable with a user-facing error message.
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }
}
