import { Component, inject, OnInit } from '@angular/core';
import { TextInputComponent } from '../../shared/components/text-input/text-input.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  imports: [TextInputComponent, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {

  protected profileForm!: FormGroup;
  protected passwordForm!: FormGroup;

  protected fontSize: string = 'medium';
  protected theme: string = 'blue';


  private readonly formbuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  ngOnInit(): void {
    this.profileForm = this.formbuilder.group({
      id: [null],
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      nationalCode: [null],
      phoneNumber: [null, [Validators.required]],
      password: [null, [Validators.required]]
    })

    this.profileForm.patchValue(this.authService.user()!);
    this.profileForm.disable();

    this.passwordForm = this.formbuilder.group({
      currentPassword: [null, [Validators.required]],
      newPassword: [null, [Validators.required]],
      confirmPassword: [null, [Validators.required]]
    });

    const savedFont = localStorage.getItem('fontSize');
    const savedTheme = localStorage.getItem('themeColor');

    if (savedFont) {
      this.fontSize = savedFont;
    }

    if (savedTheme) {
      this.theme = savedTheme;
    }
  }

  protected submit() {
    this.authService.updateUser(this.profileForm.getRawValue()).subscribe({
      next: () => {
        this.profileForm.disable();
        alert('ویرایش اطلاعات با موفقیت انجام شد.');
      },
      error: () => {
        alert('خطا در ویرایش اطلاعات');
      }
    });
  }

  protected changePassword() {
    if (this.passwordForm.value.newPassword !== this.passwordForm.value.confirmPassword) {
      alert('رمز عبور جدید و تکرار آن مطابقت ندارند.');
      return;
    }
    this.authService.changePassword(this.passwordForm.value).subscribe({
      next: () => {
        this.passwordForm.reset();
        alert('تغییر رمز عبور با موفقیت انجام شد.');
      },
      error: () => {
        alert('خطا در تغییر رمز عبور');
      }
    });
  }

  protected setFontSize(size: 'small' | 'medium' | 'large' | 'xlarge') {
    localStorage.setItem('fontSize', size);
    document.body.classList.remove('font-small', 'font-medium', 'font-large', 'font-xlarge');
    document.body.classList.add(`font-${size}`);
  }

  protected setTheme(color: 'blue' | 'green' | 'red') {
    localStorage.setItem('themeColor', color);
    document.body.setAttribute('data-theme', color);
  }
}
