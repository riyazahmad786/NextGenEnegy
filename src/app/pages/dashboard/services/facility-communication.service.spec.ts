import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FacilityCommunicationService } from './facility-communication.service';

describe('FacilityCommunicationService', () => {
  let service: FacilityCommunicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FacilityCommunicationService,
        provideHttpClient(), // ✅ HttpClient setup
        provideHttpClientTesting(), // ✅ Testing backend
      ],
    });
    service = TestBed.inject(FacilityCommunicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
