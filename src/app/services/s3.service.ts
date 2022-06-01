import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class S3Service {
    constructor(private http: HttpClient, private authService: AuthService) {}

    uploadImage(id: number, type: string, file:any): Observable<any> {
        return this.http.post<any>(
            environment.baseUrl +
            'upload/' +
            id +
            '?type=' +
            type,
            file
        );
    }
}