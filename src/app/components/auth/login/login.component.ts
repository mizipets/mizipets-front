import { Component } from '@angular/core';
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
    loginForm: FormGroup;
    emailCtrl: FormControl;
    passwordCtrl: FormControl;
    isPasswordForgot: boolean = false;
    isCode: boolean = false;
    isPassword: boolean = false;
    currentCode: string = '';
    email: string = '';
    password: string = '';
    errorMessage: string = '';

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
        this.authenticationService.login(this.loginForm.value).subscribe({
            next: (result: { token: string }) => {
                // if (this.loginForm.value.isConnectionSave)
                localStorage.setItem('token', result.token);
                this.authenticationService.decodedToken =
                    this.authenticationService.decodeToken(result.token);
                this.router.navigate(['animals']).then();
            },
            error: (error) => {
                console.error(error);
                this.errorMessage = error.error.message;
            }
        });
    }

    checkCode(code: string): void {
        this.errorMessage = '';
        this.currentCode = code;
        this.authenticationService
            .checkCode(this.email, parseInt(code))
            .subscribe({
                next: (isValid: boolean) => {
                    if (isValid) {
                        this.isCode = false;
                        this.isPassword = true;
                    } else {
                        this.errorMessage = 'Invalid code !';
                    }
                },
                error: (error) => {
                    console.error(error);
                    this.errorMessage = error.error.message;
                }
            });
    }

    sendCode(): void {
        this.errorMessage = '';
        this.authenticationService.sendCode(this.email).subscribe({
            next: () => {
                this.isCode = true;
                this.isPasswordForgot = false;
            },
            error: (error) => {
                console.error(error);
                this.errorMessage = error.error.message;
            }
        });
    }

    resetPassword(): void {
        this.errorMessage = '';
        const loginData = {
            email: this.email,
            password: this.password
        };
        this.authenticationService
            .resetPassword(loginData, this.currentCode)
            .subscribe({
                next: () => {
                    this.isPasswordForgot = false;
                    this.isCode = false;
                    this.isPassword = false;
                },
                error: (error) => {
                    console.error(error);
                    this.errorMessage = error.error.message;
                }
            });
    }
}
