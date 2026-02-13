import { CommonModule } from '@angular/common';
import { Component, Input, Optional, Self, ViewChild, ElementRef } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'app-number-input',
  imports: [CommonModule],
  templateUrl: './number-input.component.html',
  styleUrl: './number-input.component.scss'
})
export class NumberInputComponent implements ControlValueAccessor {
  @Input() id: string = '';
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() readonly: boolean = false;
  @Input() required: boolean = false;

  @ViewChild('inputElement') inputRef!: ElementRef<HTMLInputElement>;

  disabled: boolean = false;
  private rawValue: string = ''; // Stores the raw (unformatted) value

  private onChange: (value: string) => void = () => { };
  private onTouched: () => void = () => { };

  constructor(@Optional() @Self() public ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  writeValue(value: any): void {
    this.rawValue = value != null ? String(value) : '';
    const formatted = this.formatNumber(this.rawValue);
    if (this.inputRef) {
      this.inputRef.nativeElement.value = formatted;
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event): void {
    const inputEl = event.target as HTMLInputElement;

    this.rawValue = this.parseNumber(inputEl.value);
    const formatted = this.formatNumber(this.rawValue);

    inputEl.value = formatted;
    this.onChange(this.rawValue);
  }

  onBlur(): void {
    this.onTouched();
  }

  // Formatting helpers
  private formatNumber(value: string): string {
    if (!value) return '';

    const parts = value.split('.');
    let integerPart = parts[0];
    const decimalPart = parts.length > 1 ? '.' + parts[1] : '';

    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return integerPart + decimalPart;
  }

  private parseNumber(formatted: string): string {
    let raw = '';
    let decimalFound = false;
    for (const ch of formatted) {
      if (ch >= '0' && ch <= '9') {
        raw += ch;
      } else if (ch === '.' && !decimalFound) {
        raw += ch;
        decimalFound = true;
      }
    }
    return raw;
  }

  get validationClass(): string {
    if (!this.ngControl) return '';
    const control = this.ngControl.control;
    if (!control) return '';
    if (control.valid && (control.dirty || control.touched)) {
      return 'is-valid';
    }
    if (control.invalid && (control.dirty || control.touched)) {
      return 'is-invalid';
    }
    return '';
  }

  get errorMessage(): string {
    const control = this.ngControl?.control;
    if (!control || !control.errors) return '';

    const errors = control.errors;
    const firstErrorKey = Object.keys(errors)[0];

    switch (firstErrorKey) {
      case 'required':
        return 'این فیلد الزامی است.';
      case 'email':
        return 'لطفا یک آدرس ایمیل معتبر وارد کنید.';
      case 'minlength':
        return `حداقل طول باید ${errors['minlength']?.requiredLength} کاراکتر باشد.`;
      case 'maxlength':
        return `حداکثر طول باید ${errors['maxlength']?.requiredLength} کاراکتر باشد.`;
      default:
        return 'این فیلد نامعتبر است.';
    }
  }
}