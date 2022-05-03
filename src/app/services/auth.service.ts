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
    public decodedToken: DecodedTokenModel | undefined;

    constructor(private router: Router, private http: HttpClient) {
        if(this.isLogged()) {
          this.decodedToken = this.decodeToken(this.getToken());
        }
    }

    getToken(): string {
        const token = localStorage.getItem('token');
        return token ? token : '';
    }

    register(registerData: RegisterModel): Observable<RegisterModel> {
        registerData.photoUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Unknown_person.jpg/925px-Unknown_person.jpg'
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
            environment.baseUrl + 'auth/token/' + this.decodedToken!.id + '/refresh'
        );
    }

    logout(): void {
        localStorage.removeItem('token');
        this.router.navigate(['home']).then();
    }

    checkCode(data: any): Observable<any> {
        return this.http.post<boolean>(
            environment.baseUrl + 'auth/code/check',
            data
        );
    }

    sendCode(email: string): Observable<any> {
        return this.http.get<boolean>(
            environment.baseUrl + 'auth/code?email=' + email
        );
    }

    resetPassword(login: any, code: string): Observable<any> {
        return this.http.post<any>(
            environment.baseUrl + 'auth/reset/password?code=' + code,
            login
        );
    }

    isLogged(): boolean {
        const currentToken = this.getToken();
        return !!(currentToken && currentToken.length > 1);
    }

    isTokenValid(): boolean {
        const currentDate = Math.round(new Date().getTime() / 1000);
        return Number(this.decodedToken!.exp) > currentDate;
    }

    decodeToken(token: string): any {
        return jwt_decode(token);
    }
}
