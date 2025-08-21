import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectricityConsumptionWeeklyComponent } from './electricity-consumption-weekly.component';

describe('ElectricityConsumptionWeeklyComponent', () => {
  let component: ElectricityConsumptionWeeklyComponent;
  let fixture: ComponentFixture<ElectricityConsumptionWeeklyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElectricityConsumptionWeeklyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ElectricityConsumptionWeeklyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
