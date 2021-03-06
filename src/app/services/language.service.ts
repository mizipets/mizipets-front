import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './auth.service';
import { SnackbarService } from './snackbar.service';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root'
})
export class LanguageService {
    constructor(
        public translate: TranslateService, 
        public authService: AuthService,
        public userService: UserService,
        public snackbarService: SnackbarService
    ) {}

    get locale(): string {
        return (
            this.translate.currentLang ??
            localStorage.getItem('language') ??
            'fr'
        );
    }

    set locale(language: string) {
        this.translate.use(language);
        localStorage.setItem('language', language);
        if(this.authService.isLogged()) {
            const token = this.authService.getToken();
            if(token) {
                const decodedToken = this.authService.decodeToken(token)
                this.userService.updateUserLang(decodedToken.id, language).subscribe(_ => {
                    this.snackbarService.openSuccess('Language Changed')
                })
            }
        }
    }
}
