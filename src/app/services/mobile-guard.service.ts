import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Router,
    RouterStateSnapshot
} from '@angular/router';
import { DeviceDetectorService } from "ngx-device-detector";


@Injectable({
    providedIn: 'root'
})
export class MobileGuardService {
    constructor(
        private deviceDetectorService: DeviceDetectorService,
        private router: Router
    ) {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {
        if (this.deviceDetectorService.isMobile() || this.deviceDetectorService.isTablet()) {
            this.router.navigate(['']).then();
            return false;
        }
        return true;
    }
}
