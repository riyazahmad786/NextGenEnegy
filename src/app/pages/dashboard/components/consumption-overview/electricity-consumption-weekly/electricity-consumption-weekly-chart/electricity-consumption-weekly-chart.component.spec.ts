import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectricityConsumptionWeeklyChartComponent } from './electricity-consumption-weekly-chart.component';

describe('ElectricityConsumptionWeeklyChartComponent', () => {
  let component: ElectricityConsumptionWeeklyChartComponent;
  let fixture: ComponentFixture<ElectricityConsumptionWeeklyChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElectricityConsumptionWeeklyChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      ElectricityConsumptionWeeklyChartComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
