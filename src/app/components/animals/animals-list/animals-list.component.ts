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
  liked: number[] = [];
  adoptionChecked: boolean = false;

  constructor(private animalService: AnimalsService) { }

  ngOnInit(): void {
    const storageValue = localStorage.getItem('valueCols');
    const storageLiked = localStorage.getItem('liked');
    if(storageValue)
      this.valueCols = parseInt(storageValue);

    if(storageLiked)
      this.liked = storageLiked.split(',').map(x => +x);

    this.animalService.getUserAnimals().subscribe(animals => this.animals = animals);
  }

  setValueColsToStorage(): number {
    localStorage.setItem('valueCols', this.valueCols.toString());
    return 0;
  }

  adopted(id: number, isLiked: boolean = false): void {
    const index = this.liked.indexOf(id);
    isLiked ? this.liked.push(id) : this.liked.splice(index, 1);
    localStorage.setItem('liked', this.liked.toString());
    //Update animal "isAdoption" to false
  }
}
