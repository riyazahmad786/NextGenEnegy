import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeNegativeSign',
  standalone: true,
})
export class RemoveNegativeSignPipe implements PipeTransform {
  transform(value: number): number {
    return Math.abs(value);
  }
}
