import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { BuildingDashboardService } from './building-dashboard.service';

describe('BuildingDashboardService', () => {
  let service: BuildingDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BuildingDashboardService,
        provideHttpClient(), // ✅ HttpClient setup
        provideHttpClientTesting(), // ✅ Testing backend
      ],
    });
    service = TestBed.inject(BuildingDashboardService);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
