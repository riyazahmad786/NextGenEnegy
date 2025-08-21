import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstLetter',
  standalone: true,
})
export class FirstLetterPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return ''; // Handle empty input
    return value.charAt(0).toUpperCase();
  }
}
