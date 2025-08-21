import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'compactNumber',
  standalone: true,
})
export class CompactNumberPipe implements PipeTransform {
  transform(value: number | string, ...args: unknown[]): string {
    let num = parseFloat(value as string);
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'; // Millions
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'; // Thousands
    } else {
      return num.toString(); // Less than 1000
    }
  }
}
