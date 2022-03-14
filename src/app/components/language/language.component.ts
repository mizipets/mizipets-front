import { Component, OnInit } from '@angular/core';
import { Languages } from './languages.enum';

@Component({
  selector: 'language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss']
})
export class LanguageComponent implements OnInit {

  languages: string[] = Object.values(Languages)
  
  constructor() { }

  ngOnInit(): void {
    console.log(this.languages);
    
  }

}
