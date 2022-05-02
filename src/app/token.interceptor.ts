import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {AuthService} from "./services/auth.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) {}

    intercept(
        request: HttpRequest<unknown>,
        next: HttpHandler
    ): Observable<HttpEvent<unknown>> {
        let authorization = request.headers.get('Authorization');
        if (!authorization && localStorage.getItem('token')) {
            authorization = `Bearer ${localStorage.getItem('token')}`;
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
