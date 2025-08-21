import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FacilityCommunicationService {
  private reloadChartSource = new Subject<{ fid: number; userID: number }>();
  reloadChart$ = this.reloadChartSource.asObservable();

  constructor() {}

  emitReloadChart(fid: number, userID: number): void {
    this.reloadChartSource.next({ fid, userID });
  }

  private reloadChartData = new Subject<{ chartData: any[] }>();
  reloadChartData$ = this.reloadChartData.asObservable();

  emitReloadChartData(chartData: any[]): void {
    this.reloadChartData.next({ chartData });
  }
}
