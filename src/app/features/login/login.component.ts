import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NumberInputComponent } from "../../shared/components/number-input/number-input.component";
import { TextInputComponent } from '../../shared/components/text-input/text-input.component';

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

  constructor(private formbuilder: FormBuilder) { }

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

    // if (this.authService.isLoggedIn()) {
    //   this.router.navigate(['dashboard']);
    // }
  }

  protected login() {
    alert('this method is not implemented.')
  }


  protected signUp() {
    alert('this method is not implemented.')
  }
}

