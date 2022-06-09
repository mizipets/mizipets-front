import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpEvent,
    HttpErrorResponse
} from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor(
        private authService: AuthService,
        private snackBar: MatSnackBar
    ) {}

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const token = this.authService.getToken();
        if (token !== null) {
            request = this.addToken(request, token);
        }

        return next.handle(request).pipe(
            catchError((error) => {
                if (error instanceof HttpErrorResponse &&
                    !request.url.includes('auth/login') &&
                    error.status === 401
                ) {
                  return this.handle401Error(request, next);
                }

                return throwError(error);
            })
        );
    }

    private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
      if (!this.isRefreshing) {
        this.isRefreshing = true;
        this.refreshTokenSubject.next(null);
        const token = this.authService.getRefreshToken();

        if (token)
          return this.authService.refreshToken(token).pipe(
            switchMap((result: { token: string; refreshKey: string }) => {
              this.isRefreshing = false;
              this.authService.setToken(result.token);
              this.refreshTokenSubject.next(result.token);
              return next.handle(this.addToken(request, result.token));
            }),
            catchError((err) => {
              this.isRefreshing = false;
              return throwError(err);
            })
          )
      }
      if(request.url.includes('auth/token')){
        this.isRefreshing = false;
        this.authService.logout();
        this.snackBar.open(
          "Session expired, please sign in",
          "",
          {
            duration: 2000,
            horizontalPosition: "center",
            verticalPosition: "top"
          }
        );
        return throwError(request.body);
      }

      return this.refreshTokenSubject.pipe(
            filter((token) => token !== null),
            take(1),
            switchMap((token) => next.handle(this.addToken(request, token)))
      );
    }

    private addToken(request: HttpRequest<any>, token: string) {
        return request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }
}
