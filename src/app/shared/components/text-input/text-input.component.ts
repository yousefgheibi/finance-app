import { CommonModule } from '@angular/common';
import { Component, forwardRef, input, Optional, Self, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  imports: [CommonModule],
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextInputComponent),
      multi: true
    }
  ]
})
export class TextInputComponent implements ControlValueAccessor {
  id = input<string>('');
  label = input<string>('');
  placeholder = input<string>('');
  type = input<string>('text');
  readonly = input<boolean>(false);
  required = input<boolean>(false);

  value = signal<string>('');
  disabled = signal<boolean>(false);

  private onChange: (value: string) => void = () => { };
  private onTouched: () => void = () => { };

  constructor(@Optional() @Self() public ngControl: NgControl | null) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  writeValue(value: string): void {
    this.value.set(value || '');
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
    this.value.set(input.value);
    this.onChange(this.value());
  }

  onBlur(): void {
    this.onTouched();
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