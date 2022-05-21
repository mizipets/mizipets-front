import { Component, OnInit } from '@angular/core';
import { AnimalsService } from '../../../services/animals.service';
import { AnimalModel } from '../../../models/animal.model';

@Component({
    selector: 'app-animals-list',
    templateUrl: './animals-list.component.html',
    styleUrls: ['./animals-list.component.scss']
})
export class AnimalsListComponent implements OnInit {
    /**
     *  Check is side menu is opened
     */
    isOpen: boolean = true;
    /**
     * Pass value to true to activate the spinner
     */
    isLoading: boolean = false;
    /**
     * Filter checkbox to display adopted animals
     */
    adoptionChecked: boolean = false;
    /**
     * Number of animals on grid line
     */
    valueCols: number = 3;
    /**
     * Animals list based on Animal model
     */
    animals: AnimalModel[] = [];
    /**
     * Animals list filtered, based on Animal model
     */
    filteredAnimals: AnimalModel[] = [];

    constructor(private animalService: AnimalsService) {}

    ngOnInit(): void {
        this.isLoading = true;
        const storageValue = localStorage.getItem('valueCols');
        if (storageValue) this.valueCols = parseInt(storageValue);

        this.animalService.getUserAnimals().subscribe({
            next: (animals: AnimalModel[]) => {
                this.animals = animals;
                let x= 0
                while (x < 100) {
                  this.animals.push(animals[0]);
                  x+=1;
                }
                this.filterList();
                this.isLoading = false;
            },
            error: (error) => {
                console.error(error);
                this.isLoading = false;
            }
        });
    }

    setValueColsToStorage(): number {
        localStorage.setItem('valueCols', this.valueCols.toString());
        return 0;
    }

    filterList(isAdoption: boolean = true): void {
        this.filteredAnimals = this.animals.filter(
            (animal) => animal.isAdoption === isAdoption
        );
    }
}
