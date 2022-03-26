import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    hide = true;
    isPasswordForgot = false;
    isCode = false;
    isPassword = false;
    loginForm: FormGroup;
    emailCtrl: FormControl;
    passwordCtrl: FormControl;
    currentCode = '';
    email = '';
    password = '';
    errorMessage = '';

    constructor(
        public formBuilder: FormBuilder,
        private authenticationService: AuthService,
        private router: Router
    ) {
        this.emailCtrl = formBuilder.control('', Validators.required);
        this.passwordCtrl = formBuilder.control('', Validators.required);

        this.loginForm = formBuilder.group({
            email: this.emailCtrl,
            password: this.passwordCtrl,
            isConnectionSave: new FormControl(true)
        });
    }

    onSubmit(): void {
        this.authenticationService.login(this.loginForm.value).subscribe(
            (result) => {
                // if (this.loginForm.value.isConnectionSave)
                localStorage.setItem('token', result.token);
                this.authenticationService.decodedToken = this.authenticationService.decodeToken(result.token);
                this.router.navigate(['dashboard']).then();
            },
            (e) => {
                this.errorMessage = e.error.message;
            }
        );
    }

    checkCode(code: string): void {
        this.errorMessage = '';
        this.currentCode = code;
        const data = {
            email: this.email,
            code: code
        };
        this.authenticationService.checkCode(data).subscribe((isValid) => {
            if (isValid) {
                this.isCode = false;
                this.isPassword = true;
            } else {
                this.errorMessage = 'Invalid Code !';
            }
        });
    }

    sendCode(): void {
        this.errorMessage = '';
        this.authenticationService.sendCode(this.email).subscribe(
            () => {
                this.isCode = true;
                this.isPasswordForgot = false;
            },
            (error) => {
                this.errorMessage = 'Invalid Email !';
            }
        );
    }

    resetPassword(): void {
        this.errorMessage = '';
        const loginData = {
            email: this.email,
            password: this.password
        };
        this.authenticationService
            .resetPassword(loginData, this.currentCode)
            .subscribe(
                () => {
                    this.isPasswordForgot = false;
                    this.isCode = false;
                    this.isPassword = false;
                },
                (error) => {
                    this.errorMessage = error.message;
                }
            );
    }
}
