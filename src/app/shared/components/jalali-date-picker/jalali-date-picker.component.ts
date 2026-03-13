import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, input, Optional, Self, signal } from '@angular/core';
import { ControlValueAccessor, FormsModule, NgControl } from '@angular/forms';
import * as jalaali from 'jalaali-js';

@Component({
  selector: 'app-jalali-date-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './jalali-date-picker.component.html',
  styleUrl: './jalali-date-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JalaliDatePickerComponent implements ControlValueAccessor {

  label = input<string>('');
  placeholder = input<string>('');
  required = input<boolean>(false);
  disabled = signal<boolean>(false);

  private readonly today = new Date();
  protected readonly monthNames = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];

  protected isDatePickerOpen = signal<boolean>(false);
  protected currentYear = signal<number>(0);
  protected currentMonth = signal<number>(0);
  protected days = signal<number[]>([]);
  protected display = signal<string>('');

  private value: any | null = null;

  private onChange: (value: string) => void = () => { };
  private onTouched: () => void = () => { };

  constructor(@Optional() @Self() public ngControl: NgControl | null) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
      const currentJalaliDate = jalaali.toJalaali(this.today);
      this.currentYear.set(currentJalaliDate.jy);
      this.currentMonth.set(currentJalaliDate.jm);
      this.generateCalendarDays();
    }
  }

  protected toggle() {
    this.isDatePickerOpen.update(v => !v);
    this.onTouched();
  }

  protected clearDate() {
    this.value = null;
    this.display.set('');
    this.onChange(this.value);
    this.onTouched();
  }

  protected prevMonth() {
    if (this.currentMonth() === 1) {
      this.currentMonth.set(12);
      this.currentYear.update(v => v - 1);
    }
    else {
      this.currentMonth.update(v => v - 1);
    }
    this.generateCalendarDays();
  }

  protected nextMonth() {
    if (this.currentMonth() === 12) {
      this.currentMonth.set(1);
      this.currentYear.update(v => v + 1);
    }
    else {
      this.currentMonth.update(v => v + 1);
    }
    this.generateCalendarDays();
  }

  protected selectDate(day: number) {
    const g = jalaali.toGregorian(this.currentYear(), this.currentMonth(), day);
    const date = new Date(g.gy, g.gm - 1, g.gd);
    this.value = date;
    this.display.set(`${this.currentYear()}/${this.pad(this.currentMonth())}/${this.pad(day)}`)
    this.isDatePickerOpen.set(false);
    this.onChange(this.value);
    this.onTouched();
  }

  protected isSelected(day: number) {
    if (!this.value) return false;
    const currentJalaliDate = jalaali.toJalaali(this.value);
    return day === currentJalaliDate.jd && this.currentMonth() === currentJalaliDate.jm && this.currentYear() === currentJalaliDate.jy;
  }

  protected isToday(day: number) {
    const currentJalaliDate = jalaali.toJalaali(this.today);
    return day === currentJalaliDate.jd && this.currentMonth() === currentJalaliDate.jm && this.currentYear() === currentJalaliDate.jy;
  }

  private pad(v: number) {
    return v < 10 ? `0${v}` : v;
  }

  private generateCalendarDays() {
    const monthLength = jalaali.jalaaliMonthLength(this.currentYear(), this.currentMonth());
    const arr = [];
    for (let i = 1; i <= monthLength; i++) {
      arr.push(i);
    }
    this.days.set(arr);
  }

  writeValue(value: Date): void {
    this.value = value;
    if (value) {
      const currentJalaliDate = jalaali.toJalaali(value);
      this.display.set(`${currentJalaliDate.jy}/${this.pad(currentJalaliDate.jm)}/${this.pad(currentJalaliDate.jd)}`);
      this.currentYear.set(currentJalaliDate.jy);
      this.currentMonth.set(currentJalaliDate.jm);
      this.generateCalendarDays();
      this.onChange(this.value);
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
      default:
        return 'این فیلد نامعتبر است.';
    }
  }

  @HostListener('document:click', ['$event.target'])
  clickOutside(target: HTMLElement) {
    const el = document.querySelector('app-jalali-date-picker');
    if (el && !el.contains(target)) this.isDatePickerOpen.set(false);
  }
}
