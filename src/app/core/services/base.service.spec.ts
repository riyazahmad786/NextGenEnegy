import { TestBed } from '@angular/core/testing';

import { BaseService } from './base.service';


describe('BaseService', () => {
  let service: BaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BaseService]
    });
    service = TestBed.get(BaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
