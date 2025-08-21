import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TableLayoutService } from './table-layout.service';

describe('TableLayoutService', () => {
  let service: TableLayoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TableLayoutService,
        provideHttpClient(), // ✅ HttpClient setup
        provideHttpClientTesting(), // ✅ Testing backend
      ],
    });
    service = TestBed.inject(TableLayoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
