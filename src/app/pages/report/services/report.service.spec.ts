import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ReportService } from './report.service';
import { of } from 'rxjs';
import { HourlyConsumptionComponent } from '../electricity/hourly-consumption/hourly-consumption.component';

const mockReportService = {
  getHourlyConsumption: jasmine
    .createSpy('getHourlyConsumption')
    .and.returnValue(of([{ hour: '10 AM', consumption: 50 }])),
};

describe('ReportService', () => {
  let service: ReportService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HourlyConsumptionComponent],
      providers: [
        { provide: ReportService, useValue: mockReportService },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
    service = TestBed.inject(ReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
