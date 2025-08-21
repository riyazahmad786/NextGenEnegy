import { CommonModule } from '@angular/common';
import { Component, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Facility, LocationModel } from '../../core/models/facility';
import { StorageService } from '../../core/services/storage.service';
import { HeaderService } from '../../layout/header/services/header.service';
import { AppStateService } from '../../shared/service/app-state.service';
import { FacilityDashboardService } from '../dashboard/services/facility-dashboard.service';
import { DateRangeComponent } from './components/date-range/date-range.component';
import { SchedulerComponent } from './components/scheduler/scheduler.component';
import { UploadImageComponent } from './components/upload-image/upload-image.component';
@Component({
  selector: 'app-setting',
  standalone: true,
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.css',
  imports: [
    CommonModule,
    DateRangeComponent,
    FormsModule,
    RouterModule,
    UploadImageComponent,
    SchedulerComponent,
  ],
})
export class SettingComponent {
  userRole: any;
  constructor(
    private facilityService: FacilityDashboardService,
    private storagesService: StorageService,
    private appState: AppStateService,
    private headerService: HeaderService
  ) {
    this.userId.set(this.storagesService.getUserId());
    this.userRole = this.appState.getParameter('UserRole') || '';
    this.loadFacilities(this.userId());
    this.headerService.isLogin(true);
  }

  siteId: WritableSignal<number> = signal(0);
  facilityId: WritableSignal<number> = signal(0);
  userId: WritableSignal<number> = signal(0);
  selectedOrg?: Facility;
  locations: LocationModel[] = [];
  facilities: Facility[] = [];
  loadFacilities(userId: number): void {
    this.facilityService.getFacilities(userId).subscribe(
      (data: any) => {
        this.facilities = data.Table as Facility[];
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }
  shouldShowAdminLink(): boolean {
    return ['Super Admin'].includes(this.userRole);
  }
  loadBuildings(facilityId: number, userId: number): void {
    if (!facilityId || !userId) return;
    this.facilityService.getBuildings(facilityId, userId).subscribe(
      (data) => {
        this.locations = (data as any).Table;
      },
      (error) => console.error('Error fetching buildings:', error)
    );
  }
  onFacilityChange(e: any) {
    this.locations = [];
    const fid = e.target.value;
    if (fid != null && fid != 0) {
      this.facilityId.set(fid);
      this.loadBuildings(fid, this.userId());
    }
  }

  onLocationChange(e: any) {
    const sid = e.target.value;
    if (sid != null && sid != 0) {
      this.siteId.set(sid);
    } else {
      this.siteId.set(0);
    }
  }
}
