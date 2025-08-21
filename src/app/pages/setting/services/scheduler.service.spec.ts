import { TestBed } from '@angular/core/testing';

import { SchedulerService } from './scheduler.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('SchedulerService', () => {
  let service: SchedulerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SchedulerService,
        provideHttpClient(), // ✅ HttpClient setup
        provideHttpClientTesting(), // ✅ Testing backend
      ],
    });
    service = TestBed.inject(SchedulerService);
  });
  

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
