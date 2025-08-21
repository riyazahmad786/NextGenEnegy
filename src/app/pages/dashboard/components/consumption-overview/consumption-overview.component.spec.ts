import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumptionOverviewComponent } from './consumption-overview.component';

describe('ConsumptionOverviewComponent', () => {
  let component: ConsumptionOverviewComponent;
  let fixture: ComponentFixture<ConsumptionOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsumptionOverviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConsumptionOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
