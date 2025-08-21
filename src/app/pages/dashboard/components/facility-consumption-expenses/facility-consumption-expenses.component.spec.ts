import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityConsumptionExpensesComponent } from './facility-consumption-expenses.component';

describe('FacilityConsumptionExpensesComponent', () => {
  let component: FacilityConsumptionExpensesComponent;
  let fixture: ComponentFixture<FacilityConsumptionExpensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacilityConsumptionExpensesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FacilityConsumptionExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
