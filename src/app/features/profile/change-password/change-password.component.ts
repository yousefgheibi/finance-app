import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { TextInputComponent } from '../../../shared/components/text-input/text-input.component';
import { ModalService } from '../../../shared/services/modal.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-change-password',
  imports: [TextInputComponent, ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangePasswordComponent implements OnInit {


  protected passwordForm!: FormGroup;

  private readonly formbuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly modalService = inject(ModalService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastService = inject(ToastService);

  ngOnInit(): void {
    this.passwordForm = this.formbuilder.group({
      currentPassword: [null, [Validators.required]],
      newPassword: [null, [Validators.required, Validators.minLength(6)]],
      confirmPassword: [null, [Validators.required, Validators.minLength(6)]]
    });
  }

  protected changePassword() {
    if (this.passwordForm.value.newPassword !== this.passwordForm.value.confirmPassword) {
      this.toastService.warning('رمز عبور جدید و تکرار آن مطابقت ندارند.');
      return;
    }
    this.authService.changePassword(this.passwordForm.getRawValue())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.passwordForm.reset();
          this.modalService.close();
          this.toastService.success('تغییر رمز عبور با موفقیت انجام شد.');
        },
        error: () => {
          this.toastService.error('خطا در تغییر رمز عبور');
        }
      });
  }
}
