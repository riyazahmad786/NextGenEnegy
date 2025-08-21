import { TestBed } from '@angular/core/testing';

import {  provideHttpClientTesting } from '@angular/common/http/testing';
import { FacilityDashboardService } from './facility-dashboard.service';
import { provideHttpClient } from '@angular/common/http';

describe('FacilityDashboardService', () => {
  let service: FacilityDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FacilityDashboardService,
        provideHttpClient(), // ✅ HttpClient setup
        provideHttpClientTesting(), // ✅ Testing backend
      ],
    });
    service = TestBed.inject(FacilityDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
