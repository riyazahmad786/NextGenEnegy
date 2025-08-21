import { TestBed } from '@angular/core/testing';

import { LabelProcessorService } from './label-processor.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('LabelProcessorService', () => {
  let service: LabelProcessorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LabelProcessorService,
        provideHttpClient(), // ✅ HttpClient setup
        provideHttpClientTesting(), // ✅ Testing backend
      ],
    });
    service = TestBed.inject(LabelProcessorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
