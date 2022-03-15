import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from './language.service';
import { Languages } from './languages.enum';
import { LanguagesDisplay } from './languagesDisplay.enum';

@Component({
    selector: 'language',
    templateUrl: './language.component.html',
    styleUrls: ['./language.component.scss']
})
export class LanguageComponent implements OnInit {
    languages: string[] = Object.values(Languages);
    languagesDisplay = Object.fromEntries(Object.entries(LanguagesDisplay));

    constructor(
        public languageService: LanguageService,
        public translate: TranslateService
    ) {}

    ngOnInit(): void {}

    langFlag(lang: string): string {
        return '../../../assets/images/' + lang + '.svg';
    }

    changeLang(lang: string): void {
        this.languageService.locale = lang;
        this.translate.use(lang);
    }
}
