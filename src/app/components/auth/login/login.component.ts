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
export class LoginComponent implements OnInit {
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
        private authService: AuthService,
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

    ngOnInit(): void {
        if (this.authService.isLogged()) {
            this.router.navigate(['animals']).then();
        }
    }

    onSubmit(): void {
        this.authService.login(this.loginForm.value).subscribe({
            next: (result: { token: string; refreshKey: string }) => {
                localStorage.setItem('isTokenStored', this.loginForm.value.isConnectionSave);
                this.authService.isTokenStored = this.loginForm.value.isConnectionSave;
                this.authService.setToken(result.token);
                this.authService.setRefreshToken(result.refreshKey);
                this.authService.decodedToken = this.authService.decodeToken(result.token);
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
        this.authService
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
        this.authService.sendCode(this.email).subscribe({
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
        this.authService
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
