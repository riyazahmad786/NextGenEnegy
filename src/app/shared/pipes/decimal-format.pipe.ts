import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'decimalFormat',
  standalone: true,
})
export class DecimalFormatPipe implements PipeTransform {
  transform(value: number): string {
    // Check if the value is a valid number
    if (isNaN(value) || value === null || value === undefined) {
      return '';
    }

    // Round the number to two decimal places and convert it to a string
    const roundedValue = Number(value.toFixed(0));

    // Format the number with exactly two decimal places
    return roundedValue.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
}
