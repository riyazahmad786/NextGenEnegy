import { Pipe, PipeTransform } from '@angular/core';
import { RoundingService } from '../../core/utils/rounding.service';

@Pipe({
  name: 'rounding',
  standalone: true,
})
export class RoundingPipe implements PipeTransform {
  constructor(private roundingService: RoundingService) {}

  transform(value: number): number {
    return this.roundingService.roundToNearestInteger(value);
  }
}
