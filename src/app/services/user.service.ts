import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { UserModel } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private http: HttpClient, private authService: AuthService) {}

    getUser(): Observable<UserModel> {
        return this.http.get<UserModel>(
            environment.baseUrl + 'users/' + this.authService.decodedToken!.id
        );
    }

    updateUser(userData: UserModel): Observable<UserModel> {
        return this.http.put<UserModel>(
            environment.baseUrl + 'users/' + this.authService.decodedToken!.id,
            userData
        );
    }
    
    updateUserLang(id: number, lang: string): Observable<void> {
        return this.http.put<void>(
            environment.baseUrl + 'users/' + id + '/lang',
            {
                lang: lang
            }
        );
    }

    closeUser(): Observable<any> {
        return this.http.put<any>(
            environment.baseUrl +
                'users/' +
                this.authService.decodedToken!.id +
                '/close',
            ''
        );
    }
}
