import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'PointFormatType',
})
export class PointFormatTypePipe implements PipeTransform {
  transform(units: string): string {
    switch (units) {
      case 'kWh/Sq-ft':
        return 'point.y:.2f';
      case 'kWh':
        return 'point.y:.0f';
      // Add more cases if needed
      default:
        return 'point.y:.0f';
    }
  }
}
