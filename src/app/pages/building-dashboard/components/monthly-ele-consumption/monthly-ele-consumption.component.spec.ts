import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyEleConsumptionComponent } from './monthly-ele-consumption.component';

describe('MonthlyEleConsumptionComponent', () => {
  let component: MonthlyEleConsumptionComponent;
  let fixture: ComponentFixture<MonthlyEleConsumptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthlyEleConsumptionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MonthlyEleConsumptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
