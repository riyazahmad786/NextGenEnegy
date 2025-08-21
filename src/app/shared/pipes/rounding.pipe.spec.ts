import { TestBed } from '@angular/core/testing';
import { RoundingPipe } from './rounding.pipe';

describe('RoundingPipe', () => {
  let pipe: RoundingPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RoundingPipe],
    });
    pipe = TestBed.inject(RoundingPipe);
  });

  it('should round numbers', () => {
    expect(pipe.transform(3.14159)).toBe(3.14);
  });
});
