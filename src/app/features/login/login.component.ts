import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NumberInputComponent } from "../../shared/components/number-input/number-input.component";
import { TextInputComponent } from '../../shared/components/text-input/text-input.component';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, NumberInputComponent, TextInputComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class LoginComponent implements OnInit {

  protected loginForm!: FormGroup;
  protected signUpForm!: FormGroup;
  protected isLoginPage = signal<boolean>(true);

  private readonly formbuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastService = inject(ToastService);

  ngOnInit() {
    this.loginForm = this.formbuilder.group(
      {
        phoneNumber: [null, [Validators.required]],
        password: [null, [Validators.required]]
      }
    );

    this.signUpForm = this.formbuilder.group({
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      nationalCode: [null],
      phoneNumber: [null, [Validators.required]],
      password: [null, [Validators.required]]
    })

    if (this.authService.isLoggedIn()) {
      this.router.navigate(['dashboard']);
    }
  }

  protected login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.authService.login(this.loginForm.getRawValue())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (user) => {
          this.router.navigate(['/dashboard']);
        },
        error: () => {
          this.toastService.error('شماره موبایل یا رمز اشتباه است');
        }
      });
  }


  protected signUp() {
    if (this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched();
      return;
    }

    this.authService.signUp(this.signUpForm.getRawValue())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.success('ثبت نام با موفقیت انجام شد');
          this.isLoginPage.set(true);
        },
        error: () => {
          this.toastService.error('خطا در ثبت نام');
        }
      });
  }
}

