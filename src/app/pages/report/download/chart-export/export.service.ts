import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExportService {
  private exportUrl = 'https://export.highcharts.com/';

  constructor(private http: HttpClient) {}

  exportChart(chartOptions: any): Observable<Blob> {
    return this.http.post(this.exportUrl, chartOptions, {
      responseType: 'blob',
    });
  }
}
