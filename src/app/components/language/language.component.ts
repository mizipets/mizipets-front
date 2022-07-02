import { Component } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { Languages } from '../../models/enums/languages.enum';
import { LanguagesDisplay } from '../../models/enums/languagesDisplay.enum';

@Component({
    selector: 'language',
    templateUrl: './language.component.html',
    styleUrls: ['./language.component.scss']
})
export class LanguageComponent {
    languages: string[] = Object.values(Languages);
    languagesDisplay = Object.fromEntries(Object.entries(LanguagesDisplay));

    constructor(public languageService: LanguageService) {}

    langFlag(lang: string): string {
        return '../../../assets/images/' + lang + '.svg';
    }

    changeLang(lang: string): void {
        this.languageService.locale = lang;
    }
}
