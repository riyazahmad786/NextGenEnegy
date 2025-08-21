import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  BsDatepickerModule,
  BsDaterangepickerConfig,
} from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-date-range-picker',
  standalone: true,
  imports: [CommonModule, FormsModule, BsDatepickerModule],
  template: `
    <div class="form-group">
      <label>{{ label }}: </label>
      <input
        type="text"
        class="form-control"
        placeholder="yyyy-mm-dd-yyyy-mm-dd"
        bsDaterangepicker
        [bsConfig]="config"
        [(ngModel)]="rangeValue"
        name="dateRangePicker"
        autocomplete="off"
      />
    </div>
  `,
  styles: [
    `
      .form-group {
        margin-bottom: 1rem;
      }
    `,
  ],
})
export class DateRangePickerComponent {
  @Input() label?: string;
  @Input() config?: Partial<BsDaterangepickerConfig>;
  @Input() rangeValue?: Date[];
}
