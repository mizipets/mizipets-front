import { Component, OnInit } from '@angular/core';
import { LanguageService } from './language.service';
import { Languages } from './languages.enum';
import { LanguagesDisplay } from './languagesDisplay.enum';

@Component({
  selector: 'language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss'],
})
export class LanguageComponent implements OnInit {
  languages: string[] = Object.values(Languages);
  languagesDisplay = Object.fromEntries(Object.entries(LanguagesDisplay));

  constructor(public languageService: LanguageService) {}

  ngOnInit(): void {}

  langFlag(lang: string) {
    return '../../../assets/images/' + lang + '.svg';
  }
}
