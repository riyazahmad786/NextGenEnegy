import { TestBed } from '@angular/core/testing';

import { RoundingService } from './rounding.service';

describe('RoundingService', () => {
  let service: RoundingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoundingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
