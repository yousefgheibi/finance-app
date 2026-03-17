import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit } from '@angular/core';
import { TextInputComponent } from '../../shared/components/text-input/text-input.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ModalService } from '../../shared/services/modal.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastService } from '../../shared/services/toast.service';
import { ThemeServcie } from '../../core/services/theme.service';

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
  protected fontSize = computed(() => this.themeService.currentFontSize());
  protected theme = computed(() => this.themeService.currentTheme());

  private readonly formbuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly modalService = inject(ModalService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastService = inject(ToastService);
  private readonly themeService = inject(ThemeServcie);

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
    this.themeService.updateFontSize(size);
  }

  protected setTheme(color: 'blue' | 'green' | 'red') {
    this.themeService.updateTheme(color);
  }

  protected openChangePasswordModal() {
    this.modalService.open({
      component: ChangePasswordComponent,
      title: 'تغییر رمز عبور',
      size: 'md'
    });
  }
}
