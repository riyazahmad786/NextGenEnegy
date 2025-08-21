import { TestBed } from '@angular/core/testing';

import { DateHandlingService } from './date-handling.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('DateHandlingService', () => {
  let service: DateHandlingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DateHandlingService,
        provideHttpClient(), // ✅ HttpClient setup
        provideHttpClientTesting(), // ✅ Testing backend
      ],
    });
    service = TestBed.inject(DateHandlingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
