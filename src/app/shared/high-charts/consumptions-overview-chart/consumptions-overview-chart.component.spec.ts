import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumptionsOverviewChartComponent } from './consumptions-overview-chart.component';

describe('ConsumptionsOverviewChartComponent', () => {
  let component: ConsumptionsOverviewChartComponent;
  let fixture: ComponentFixture<ConsumptionsOverviewChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsumptionsOverviewChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConsumptionsOverviewChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
