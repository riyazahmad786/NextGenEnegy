import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DateHandlingService {
  constructor(private datePipe: DatePipe) {}
  transformDate(date: Date, type: string): string {
    let format: string;

    switch (type) {
      case 'Hourly':
        format = 'yyyy-MM-dd';
        break;
      case 'Daily':
        format = 'yyyy-MM-dd';
        break;
      case 'Monthly':
        format = 'yyyy-MM';
        break;
      case 'Yearly':
        format = 'yyyy';
        break;
      default:
        console.error('Invalid type provided:', type);
        return '';
    }

    return this.datePipe.transform(date, format) ?? '';
  }
}
