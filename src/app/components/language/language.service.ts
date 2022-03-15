import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LanguageService {
    get locale(): string {
        return localStorage.getItem('language') ?? 'fr';
    }

    set locale(language: string) {
        localStorage.setItem('language', language);
    }

    constructor() {}
}
