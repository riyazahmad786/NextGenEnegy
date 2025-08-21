import { CommonModule } from '@angular/common';
import { Component, Input, forwardRef } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';

@Component({
  selector: 'app-iz-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './iz-dropdown.component.html',
  styleUrl: './iz-dropdown.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IzDropdownComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => IzDropdownComponent),
      multi: true,
    },
  ],
})
export class IzDropdownComponent implements ControlValueAccessor, Validator {
  @Input() options: { value: any; label: string }[] = []; // Dropdown options
  @Input() placeholder: string = 'Select an option';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() customClass: string = ''; // Extra CSS class
  @Input() showDefaultOption: boolean = true; // Default "Select an option"
  @Input() label?: string;
  @Input() title?: string;
  inputId = 'input-' + Math.random().toString(36).substring(2, 10);
  value: string | number | null = null;
  touched = false;

  isEmpty: boolean = true;
  onChange = (_: any) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    this.value = value || '';
    this.isEmpty = !this.value;
    if (this.value && this.options.length > 0) {
      // Ensure the selected value exists in options
      const matchedOption = this.options.find(
        (option) => option.value === this.value
      );
      if (!matchedOption) {
        this.value = ''; // Reset if value is not in options
      }
    }
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
    return null;
  }

  onSelectionChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.value = selectedValue;
    this.isEmpty = selectedValue === '';
    this.onChange(selectedValue);
  }
}
