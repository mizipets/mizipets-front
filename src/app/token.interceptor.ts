import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) {}

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        let authorization = request.headers.get('Authorization');
        if (!authorization && this.authService.getToken()) {
            authorization = `Bearer ${this.authService.getToken()}`;
        }
        if (authorization) {
            const authReq = request.clone({
                headers: request.headers.set('Authorization', authorization)
            });
            return next.handle(authReq);
        } else {
            return next.handle(request);
        }
    }
}
