import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HourlyConsumptionComponent } from './hourly-consumption.component';

describe('HourlyConsumptionComponent', () => {
  let component: HourlyConsumptionComponent;
  let fixture: ComponentFixture<HourlyConsumptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HourlyConsumptionComponent],
      providers: [
        provideHttpClient(withFetch()), // ✅ HttpClient provide
        provideHttpClientTesting(), // ✅ testing backend
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HourlyConsumptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
