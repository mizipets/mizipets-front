import { Component, OnInit } from '@angular/core';
import {AnimalsService} from "../../../services/animals.service";

@Component({
  selector: 'app-animals-list',
  templateUrl: './animals-list.component.html',
  styleUrls: ['./animals-list.component.scss']
})
export class AnimalsListComponent implements OnInit {
  isOpen: boolean = true;
  valueCols: number = 3;
  animals: any[] = [];

  constructor(private animalService: AnimalsService) { }

  ngOnInit(): void {
    const storageValue = localStorage.getItem('valueCols');
    if(storageValue) {
        this.valueCols = parseInt(storageValue);
    }
    this.animalService.getUserAnimals().subscribe(animals => this.animals = animals);
  }

  setValueColsToStorage(): number {
    localStorage.setItem('valueCols', this.valueCols.toString());
    return 0;
  }
}
