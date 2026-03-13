import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { TextInputComponent } from '../../shared/components/text-input/text-input.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ModalService } from '../../shared/services/modal.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [TextInputComponent, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit {

  protected profileForm!: FormGroup;
  protected fontSize: string = 'medium';
  protected theme: string = 'blue';

  private readonly formbuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly modalService = inject(ModalService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastService = inject(ToastService);

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
    this.authService.updateUser(this.profileForm.getRawValue())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.profileForm.disable();
          this.toastService.success('ویرایش اطلاعات با موفقیت انجام شد.');
        },
        error: () => {
          this.toastService.error('خطا در ویرایش اطلاعات');
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

  protected openChangePasswordModal() {
    this.modalService.open({
      component: ChangePasswordComponent,
      title: 'تغییر رمز عبور',
      size: 'md'
    });
  }
}
