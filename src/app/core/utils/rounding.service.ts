import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RoundingService {
  constructor() {}
  roundToNearestInteger(value: number): number {
    return Math.round(value);
  }
}
