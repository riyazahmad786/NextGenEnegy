import { TestBed } from '@angular/core/testing';

import { ColumnChartService } from './column-chart.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ColumnChartService', () => {
  let service: ColumnChartService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ColumnChartService,
        provideHttpClient(), // ✅ HttpClient setup
        provideHttpClientTesting(), // ✅ Testing backend
      ],
    });
    service = TestBed.inject(ColumnChartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
