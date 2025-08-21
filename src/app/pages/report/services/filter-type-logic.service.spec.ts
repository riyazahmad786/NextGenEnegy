import { TestBed } from '@angular/core/testing';

import { FilterTypeLogicService } from './filter-type-logic.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('FilterTypeLogicService', () => {
  let service: FilterTypeLogicService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FilterTypeLogicService,
        provideHttpClient(), // ✅ HttpClient setup
        provideHttpClientTesting(), // ✅ Testing backend
      ],
    });
    service = TestBed.inject(FilterTypeLogicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
