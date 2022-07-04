import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { NotificationSocketService } from '../../../services/notification-socket.service';
import { ResetPasswordModel } from '../../../models/reset-password.model';
import { SnackbarService } from '../../../services/snackbar.service';
import { TranslateService } from "@ngx-translate/core";

export interface Device {
    browser: string;
    browser_version: string;
    deviceType: string;
    os: string;
    os_version: string;
}
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

    constructor(
        public formBuilder: FormBuilder,
        private authService: AuthService,
        private deviceService: DeviceDetectorService,
        private router: Router,
        private notificationSocket: NotificationSocketService,
        private snackBarService: SnackbarService,
        private translate: TranslateService,
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
        const device: Device = {} as Device;
        device.browser = this.deviceService.browser;
        device.browser_version = this.deviceService.browser_version;
        device.deviceType = this.deviceService.deviceType;
        device.os = this.deviceService.os;
        device.os_version = this.deviceService.os_version;
        const credential = Object.assign(this.loginForm.value, device);

        this.authService.login(credential).subscribe({
            next: (result: { token: string; refreshKey: string }) => {
                localStorage.setItem(
                    'isTokenStored',
                    this.loginForm.value.isConnectionSave
                );
                this.authService.isTokenStored =
                    this.loginForm.value.isConnectionSave;
                this.authService.setToken(result.token);
                this.authService.setRefreshToken(result.refreshKey);
                this.authService.decodedToken = this.authService.decodeToken(
                    result.token
                );
                this.notificationSocket.setId(
                    this.authService.decodeToken(
                        this.authService.getToken() ?? ''
                    ).id
                );
                this.router.navigate(['animals']).then();
            },
            error: (error) => {
                console.error(error);
            }
        });
    }

    checkCode(code: string): void {
        this.currentCode = code;
        this.authService.checkCode(this.email, parseInt(code)).subscribe({
            next: () => {
                this.isCode = false;
                this.isPassword = true;
            },
            error: (error) => {
                console.error(error);
            }
        });
    }

    sendCode(): void {
        this.authService.sendCode(this.email).subscribe({
            next: () => {
                this.isCode = true;
                this.isPasswordForgot = false;
            },
            error: (error) => {
                console.error(error);
            }
        });
    }

    resetPassword(): void {
        const data: ResetPasswordModel = {
            email: this.email,
            password: this.password,
            code: parseInt(this.currentCode)
        };
        this.authService.resetPassword(data).subscribe({
            next: () => {
                this.isPasswordForgot = false;
                this.isCode = false;
                this.isPassword = false;
                this.snackBarService.openSuccess(
                  this.translate.instant('login.registered')
                );
            },
            error: (error) => {
                console.error(error);
            }
        });
    }
}
