import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Facility } from '../../core/models/facility';

@Injectable({
  providedIn: 'root',
})
export class PropertyService {
  private facilitiesSubject = new BehaviorSubject<Facility[]>([]);
  facilities$: Observable<Facility[]> = this.facilitiesSubject.asObservable();

  private facilityDataSubject = new BehaviorSubject<Facility | undefined>(
    undefined
  );
  facilityData$: Observable<Facility | undefined> =
    this.facilityDataSubject.asObservable();

  private selectedIndexSubject = new BehaviorSubject<number | undefined>(
    undefined
  );
  selectedIndex$: Observable<number | undefined> =
    this.selectedIndexSubject.asObservable();

  private buildingsSubject = new BehaviorSubject<Location[]>([]);
  buildings$: Observable<Location[]> = this.buildingsSubject.asObservable();
  constructor() {}

  updateFacilities(facilities: Facility[]): void {
    this.facilitiesSubject.next(facilities);
  }

  updateFacilityData(facility: Facility | undefined): void {
    this.facilityDataSubject.next(facility);
  }

  updateSelectedIndex(index: number | undefined): void {
    this.selectedIndexSubject.next(index);
  }

  updateBuildings(buildings: Location[]): void {
    this.buildingsSubject.next(buildings);
  }
}
