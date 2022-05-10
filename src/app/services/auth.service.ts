import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DecodedTokenModel } from '../models/decoded-token.model';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import jwt_decode from 'jwt-decode';
import { RegisterModel } from '../models/register.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    decodedToken: DecodedTokenModel | undefined;
    isTokenStored: boolean;

    constructor(private router: Router, private http: HttpClient) {
        this.isTokenStored = localStorage.getItem('isTokenStored') === 'true';
        if (this.isLogged()) {
            this.decodedToken = this.decodeToken(this.getToken()!);
        }
    }

    getToken(): string | null {
        return this.isTokenStored ? localStorage.getItem('token') : sessionStorage.getItem('token');
    }

    getRefreshToken(): string | null {
        return localStorage.getItem('refreshKey');
    }

    register(registerData: RegisterModel): Observable<RegisterModel> {
        registerData.photoUrl = environment.userDefaultUrl;
        return this.http.post<RegisterModel>(
            environment.baseUrl + 'auth/register',
            registerData
        );
    }

    login(credential: any): Observable<any> {
        return this.http.post<any>(
            environment.baseUrl + 'auth/login',
            credential
        );
    }

    refreshToken(): Observable<any> {
        return this.http.get<any>(
            environment.baseUrl + 'auth/token/' + this.decodedToken!.id +
            '/refresh?key=' + localStorage.getItem('refreshKey')
        );
    }

    logout(): void {
        localStorage.removeItem('refreshKey');
        this.isTokenStored ? localStorage.removeItem('token') : sessionStorage.removeItem('token');
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

    resetPassword(login: any, code: string): Observable<void> {
        return this.http.put<void>(
            environment.baseUrl + 'auth/reset/password?code=' + code,
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
