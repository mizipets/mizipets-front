import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
    providedIn: 'root'
})
export class LanguageService {
    constructor(public translate: TranslateService) {}

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
    }
}
