import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private latLngPairsSubject = new Subject<any[]>();
  private latLngPairs: any[] = [];

  constructor() {}

  getLatLngPairs(): Observable<any[]> {
    return this.latLngPairsSubject.asObservable();
  }

  updateLatLngPairs(newPairs: any[]): void {
    this.latLngPairs = newPairs;
    this.latLngPairsSubject.next(this.latLngPairs);
  }
}
