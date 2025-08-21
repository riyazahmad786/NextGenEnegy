import { CommonModule } from '@angular/common';
import { Component, Input, forwardRef } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
  Validator,
} from '@angular/forms';

@Component({
  selector: 'app-iz-textbox',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './iz-textbox.component.html',
  styleUrl: './iz-textbox.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IzTextboxComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => IzTextboxComponent),
      multi: true,
    },
  ],
})
export class IzTextboxComponent implements ControlValueAccessor, Validator {
  @Input() label?: string; // ✅ Optional Label
  @Input() type: 'text' | 'number' | 'tel' = 'text';
  @Input() placeholder?: string;
  @Input() customClass: string = '';
  @Input() value?: string;
  @Input() required: boolean = false;
  @Input() minLength?: number;
  @Input() maxLength?: number;
  @Input() pattern?: string;
  @Input() disabled: boolean = false;
  @Input() title?: string;
  inputId = 'input-' + Math.random().toString(36).substring(2, 10); // ✅ Unique ID for label

  inputControl = new FormControl('', []);

  touched = false;
  isEmpty = true;
  onChange = (_: any) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    this.value = value;
    this.isEmpty = !value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    if (this.required && !control.value) {
      return { required: true };
    }
    if (this.minLength && control.value?.length < this.minLength) {
      return {
        minLength: {
          requiredLength: this.minLength,
          actualLength: control.value.length,
        },
      };
    }
    if (this.maxLength && control.value?.length > this.maxLength) {
      return {
        maxLength: {
          requiredLength: this.maxLength,
          actualLength: control.value.length,
        },
      };
    }
    if (this.pattern && !new RegExp(this.pattern).test(control.value)) {
      return { pattern: true };
    }
    return null;
  }

  onInputChange(event: any) {
    const inputValue = event.target.value;

    this.value = this.type === 'number' ? Number(inputValue) : inputValue;
    this.isEmpty = !this.value; // ✅ Now, correctly checks if value is empty

    this.onChange(this.value);
  }

  onBlur() {
    this.isEmpty = !this.value?.trim(); // ✅ Check empty state on blur
    this.onTouched();
  }
}
