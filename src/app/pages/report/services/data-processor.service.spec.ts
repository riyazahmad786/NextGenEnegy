import { TestBed } from '@angular/core/testing';

import { DataProcessorService } from './data-processor.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('DataProcessorService', () => {
  let service: DataProcessorService;

beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [
      DataProcessorService,
      provideHttpClient(), // ✅ HttpClient setup
      provideHttpClientTesting(), // ✅ Testing backend
    ],
  });
  service = TestBed.inject(DataProcessorService);
});

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
