import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityColumnChartComponent } from './facility-column-chart.component';

describe('FacilityColumnChartComponent', () => {
  let component: FacilityColumnChartComponent;
  let fixture: ComponentFixture<FacilityColumnChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacilityColumnChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FacilityColumnChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
