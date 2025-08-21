import { TestBed } from '@angular/core/testing';

import { ReadingSourceService } from './reading-source.service';

describe('ReadingSourceService', () => {
  let service: ReadingSourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReadingSourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
