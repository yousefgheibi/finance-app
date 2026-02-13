import { CommonModule } from '@angular/common';
import { Component, Optional, Self, ViewChild, ElementRef, SimpleChanges, OnChanges, input, signal } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'app-number-input',
  imports: [CommonModule],
  templateUrl: './number-input.component.html',
  styleUrl: './number-input.component.scss'
})
export class NumberInputComponent implements ControlValueAccessor, OnChanges {
  @ViewChild('inputElement') inputRef!: ElementRef<HTMLInputElement>;

  id = input<string>('');
  label = input<string>('');
  placeholder = input<string>('');
  readonly = input<boolean>(false);
  required = input<boolean>(false);
  format = input<boolean>(false);

  rawValue = signal<string>('');
  disabled = signal<boolean>(false);

  private onChange: (value: string) => void = () => { };
  private onTouched: () => void = () => { };

  constructor(@Optional() @Self() public ngControl: NgControl | null) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['format'] && this.inputRef) {
      this.inputRef.nativeElement.value = this.formatNumber(this.rawValue());
    }
  }

  writeValue(value: any): void {
    this.rawValue.set(value != null ? String(value) : '');
    const formatted = this.formatNumber(this.rawValue());
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
    this.disabled.set(isDisabled);
  }

  onInput(event: Event): void {
    const inputEl = event.target as HTMLInputElement;

    this.rawValue.set(this.parseNumber(inputEl.value));
    const formatted = this.formatNumber(this.rawValue());

    inputEl.value = formatted;
    this.onChange(this.rawValue());
  }

  onBlur(): void {
    this.onTouched();
  }

  // Formatting helpers
  private formatNumber(value: string): string {
    if (!value) return '';
    if (!this.format()) return value;

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