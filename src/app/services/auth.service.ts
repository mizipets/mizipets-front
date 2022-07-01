import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DecodedTokenModel } from '../models/decoded-token.model';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import jwt_decode from 'jwt-decode';
import { RegisterModel } from '../models/register.model';
import { NotificationSocketService } from './notification-socket.service';
import { ResetPasswordModel } from '../models/reset-password.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    decodedToken: DecodedTokenModel | undefined;
    isTokenStored: boolean;

    constructor(
        private router: Router,
        private http: HttpClient,
        private notificationSocket: NotificationSocketService
    ) {
        this.isTokenStored = localStorage.getItem('isTokenStored') === 'true';
        if (this.isLogged()) {
            this.decodedToken = this.decodeToken(this.getToken()!);
        }
    }

    getToken(): string | null {
        return this.isTokenStored
            ? localStorage.getItem('token')
            : sessionStorage.getItem('token');
    }

    getRefreshToken(): string | null {
        return localStorage.getItem('refreshKey');
    }

    setToken(token: string): void {
        this.isTokenStored
            ? localStorage.setItem('token', token)
            : sessionStorage.setItem('token', token);
    }

    setRefreshToken(token: string): void {
        localStorage.setItem('refreshKey', token);
    }

    register(registerData: RegisterModel): Observable<RegisterModel> {
        registerData.photo = environment.userDefaultUrl;
        return this.http.post<RegisterModel>(
            environment.baseUrl + 'auth/register',
            registerData
        );
    }

    login(credential: any): Observable<any> {
        return this.http.post<any>(
            environment.baseUrl + 'auth/login?onlyRole=PRO',
            credential
        );
    }

    refreshToken(tokenKey: string): Observable<any> {
        return this.http.get<any>(
            environment.baseUrl +
                'auth/token/' +
                this.decodedToken!.id +
                '/refresh?key=' +
                tokenKey
        );
    }

    logout(): void {
        this.isTokenStored
            ? localStorage.removeItem('token')
            : sessionStorage.removeItem('token');
        localStorage.removeItem('isTokenStored');
        localStorage.removeItem('refreshKey');
        this.notificationSocket.clearId();
        this.router.navigate(['home']).then();
    }

    checkCode(email: string, code: number): Observable<boolean> {
        return this.http.post<boolean>(
            environment.baseUrl + 'auth/code/verify',
            { email: email, code: code }
        );
    }

    sendCode(email: string): Observable<void> {
        return this.http.post<void>(environment.baseUrl + 'auth/code/send', {
            email: email
        });
    }

    resetPassword(login: ResetPasswordModel): Observable<void> {
        return this.http.put<void>(
            environment.baseUrl + 'auth/reset/password',
            login
        );
    }

    isLogged(): boolean {
        const currentToken = this.getToken();
        return !!currentToken;
    }

    isTokenValid(): boolean {
        const currentDate = Math.round(new Date().getTime() / 1000);
        return Number(this.decodedToken!.exp) > currentDate;
    }

    decodeToken(token: string): DecodedTokenModel {
        return jwt_decode(token);
    }
}
