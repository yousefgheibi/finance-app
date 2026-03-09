import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NumberInputComponent } from "../../shared/components/number-input/number-input.component";
import { TextInputComponent } from '../../shared/components/text-input/text-input.component';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, FormsModule, CommonModule, NumberInputComponent, TextInputComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent implements OnInit {

  protected loginForm!: FormGroup;
  protected signUpForm!: FormGroup;
  protected isLoginPage = signal<boolean>(true);

  private readonly formbuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  ngOnInit() {
    this.loginForm = this.formbuilder.group(
      {
        phoneNumber: [null, [Validators.required]],
        password: [null, [Validators.required]]
      }
    );

    this.signUpForm = this.formbuilder.group({
      name: [null, [Validators.required]],
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

    this.authService.login(this.loginForm.value).subscribe({
      next: (user) => {
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        alert('شماره موبایل یا رمز اشتباه است');
      }
    });
  }


  protected signUp() {
    if (this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched();
      return;
    }

    this.authService.signUp(this.signUpForm.value).subscribe({
      next: () => {
        alert('ثبت نام با موفقیت انجام شد');
        this.isLoginPage.set(true);
      },
      error: () => {
        alert('خطا در ثبت نام');
      }
    });
  }
}

