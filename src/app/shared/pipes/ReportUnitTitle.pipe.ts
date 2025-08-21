import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ReportUnitTitle',
})
export class ReportUnitTitlePipe implements PipeTransform {
  transform(actionType: string): string {
    switch (actionType) {
      case 'Electricity Consumption':
        return 'kWh';
      case 'Gas Consumption':
        return 'Therms';
      case 'Water Consumption':
        return 'Liters';
      case 'Sustainability Report':
        return 'kg/kWh';
      case 'Trend and Intensity Report':
        return 'kWh/Sq-ft';

      default:
        return 'kWh';
    }
  }
}
