import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-animals-list',
  templateUrl: './animals-list.component.html',
  styleUrls: ['./animals-list.component.scss']
})
export class AnimalsListComponent implements OnInit {
  isOpen: boolean = true;
  valueCols: number = 3;

  constructor() { }

  ngOnInit(): void {
    const storageValue = localStorage.getItem('valueCols');
    if(storageValue) {
        this.valueCols = parseInt(storageValue);
    }
  }

  setValueColsToStorage(): number {
    localStorage.setItem('valueCols', this.valueCols.toString());
    return 0;
  }
}
