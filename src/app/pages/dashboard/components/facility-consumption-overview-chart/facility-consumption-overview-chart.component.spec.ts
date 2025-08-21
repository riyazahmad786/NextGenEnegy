import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityConsumptionOverviewChartComponent } from './facility-consumption-overview-chart.component';

describe('FacilityConsuptionOverviewChartComponent', () => {
  let component: FacilityConsumptionOverviewChartComponent;
  let fixture: ComponentFixture<FacilityConsumptionOverviewChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacilityConsumptionOverviewChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      FacilityConsumptionOverviewChartComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
