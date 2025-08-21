import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IZColumnChartComponent } from './iz-column-chart.component';

describe('IzColumnChartComponent', () => {
  let component: IZColumnChartComponent;
  let fixture: ComponentFixture<IZColumnChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IZColumnChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IZColumnChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
