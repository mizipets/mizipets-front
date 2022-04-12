import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import {
    ActivatedRouteSnapshot,
    Router,
    RouterStateSnapshot
} from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthGuardService {
    constructor(
        private authenticationService: AuthService,
        private router: Router
    ) {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {
        if (!this.authenticationService.isLogged()) {
            this.router.navigate(['']).then();
            return false;
        }
        return true;
    }
}
