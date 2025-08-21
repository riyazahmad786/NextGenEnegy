import { TestBed } from '@angular/core/testing';

import { StatisticsCalculatorService } from './statistics-calculator.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('StatisticsCalculatorService', () => {
  let service: StatisticsCalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StatisticsCalculatorService,
        provideHttpClient(), // ✅ HttpClient setup
        provideHttpClientTesting(), // ✅ Testing backend
      ],
    });
    service = TestBed.inject(StatisticsCalculatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
