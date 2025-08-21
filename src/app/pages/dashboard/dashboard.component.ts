import { Component } from '@angular/core';
import { fromEvent, Subject, takeUntil } from 'rxjs';
import { Facility } from '../../core/models/facility';
import { AppState } from '../../core/utils/report-types-utils';
import { HeaderService } from '../../layout/header/services/header.service';
import { AppStateService } from '../../shared/service/app-state.service';
import { ConsumptionOverviewComponent } from './components/consumption-overview/consumption-overview.component';
import { FacilitiesComponent } from './components/facilities/facilities.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ConsumptionOverviewComponent, FacilitiesComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  showError: boolean = false;
  private unsubscriber: Subject<void> = new Subject<void>();
  constructor(
    private headerService: HeaderService,
    private appState: AppStateService
  ) {
    this.appState.removeParameter(AppState.LocationId);
    this.appState.removeParameter(AppState.LocationId);
    this.headerService.isLogin(true);
  }
  ngOnInit(): void {
    history.pushState(null, '');

    fromEvent(window, 'popstate')
      .pipe(takeUntil(this.unsubscriber))
      .subscribe((_) => {
        history.pushState(null, '');
        this.showError = true;
      });
  }

  ngOnDestroy(): void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }

  facility?: Facility;
  handleFacilityData(facility: Facility) {
    this.facility = facility;
  }
}
