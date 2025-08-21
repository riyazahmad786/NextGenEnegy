import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyEleConsumptionComponent } from './daily-ele-consumption.component';

describe('DailyEleConsumptionComponent', () => {
  let component: DailyEleConsumptionComponent;
  let fixture: ComponentFixture<DailyEleConsumptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyEleConsumptionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DailyEleConsumptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
