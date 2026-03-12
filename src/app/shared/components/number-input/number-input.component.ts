import { CommonModule } from '@angular/common';
import { Component, Optional, Self, input, signal, computed } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

type NumberInputType = 'number' | 'price' | 'card';

@Component({
  selector: 'app-number-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './number-input.component.html',
  styleUrl: './number-input.component.scss'
})
export class NumberInputComponent implements ControlValueAccessor {

  id = input<string>('');
  type = input<NumberInputType>('number');
  label = input<string>('');
  placeholder = input<string>('');
  readonly = input<boolean>(false);
  required = input<boolean>(false);

  rawValue = signal<string>('');
  disabled = signal<boolean>(false);

  displayValue = computed(() => {
    const value = this.rawValue();

    switch (this.type()) {
      case 'price':
        return this.formatPrice(value);
      case 'card':
        return this.formatCard(value);
      default:
        return value;
    }
  });

  private onChange: (value: string) => void = () => { };
  private onTouched: () => void = () => { };

  constructor(@Optional() @Self() public ngControl: NgControl | null) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  writeValue(value: any): void {
    this.rawValue.set(value != null ? String(value) : '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    switch (this.type()) {
      case 'price':
        value = this.parseNumber(value);
        break;
      case 'card':
        value = this.parseCard(value);
        break;
      default:
        value = this.parseNumber(value);
    }

    this.rawValue.set(value);
    this.onChange(value);
  }

  onBlur(): void {
    this.onTouched();
  }

  // Formatting helpers
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

  private parseCard(value: string): string {
    return value.replace(/\D/g, '').slice(0, 16);
  }

  private formatPrice(value: string): string {
    if (!value) return '';
    const [integerPart, decimalPart] = value.split('.');
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return decimalPart !== undefined ? `${formattedInteger}.${decimalPart}` : formattedInteger;
  }

  private formatCard(value: string): string {
    if (!value) return '';
    const parts = value.match(/.{1,4}/g);
    return parts ? parts.join(' ') : value;
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
      case 'minlength':
        return `حداقل طول باید ${errors['minlength']?.requiredLength} کاراکتر باشد.`;
      case 'maxlength':
        return `حداکثر طول باید ${errors['maxlength']?.requiredLength} کاراکتر باشد.`;
      case 'min':
        return `حداقل مقدار باید ${errors['min']?.requiredValue} باشد.`;
      case 'max':
        return `حداکثر مقدار باید ${errors['max']?.requiredValue} باشد.`;
      default:
        return 'این فیلد نامعتبر است.';
    }
  }
}