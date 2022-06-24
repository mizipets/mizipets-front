import { Component, OnInit } from '@angular/core';
import { AnimalsService } from '../../../services/animals.service';
import { AnimalModel, Sex } from '../../../models/animal.model';
import { RaceModel } from '../../../models/race.model';
import { SpecieModel } from '../../../models/specie.model';
import { SpeciesService } from '../../../services/species.service';

@Component({
    selector: 'app-animals-list',
    templateUrl: './animals-list.component.html',
    styleUrls: ['./animals-list.component.scss']
})
export class AnimalsListComponent implements OnInit {
    /**
     *  Check is side menu is opened
     */
    isOpen: boolean = false;
    /**
     * Pass value to true to activate the spinner
     */
    isLoading: boolean = false;
    /**
     * Filter checkbox to display adopted animals
     */
    adoptionChecked: boolean = false;

    /**
     * All checkbox id checked, -1 or "" if all checkbox are unchecked
     */
    storedNumbers: Array<number | string | boolean> = [true, -1, -1, '', ''];

    /**
     * Number of animals on grid line
     */
    valueCols: number = 1;
    /**
     * Animals list based on Animal model
     */
    animals: AnimalModel[] = [];
    /**
     * Animals list filtered, based on Animal model
     */
    filteredAnimals: AnimalModel[] = [];

    /**
     * Sex enum as string list
     */
    Sex: string[] = Object.values(Sex);

    /**
     * Age enum as string list
     */
    Age: string[] = Object.values(Age);

    /**
     * Species list
     */
    species: SpecieModel[] = [];

    /**
     * Races list, empty until a specie is setted
     */
    races: RaceModel[] = [];

    constructor(
        private animalService: AnimalsService,
        private specieService: SpeciesService
    ) {}

    ngOnInit(): void {
        this.isLoading = true;
        this.breakPoints();

        this.animalService.getUserAnimals().subscribe({
            next: (animals: AnimalModel[]) => {
                this.animals = animals;
                this.filter(true);
                this.isLoading = false;
            },
            error: (error) => {
                console.error(error);
                this.isLoading = false;
            }
        });

        this.specieService.getSpecies().subscribe({
            next: (species: SpecieModel[]) => {
                this.species = species;
            },
            error: (error) => {
                console.error(error);
            }
        });
    }

    orderList(): AnimalModel[] {
        return this.filteredAnimals.sort(
            (animalA, animalB) => new Date(animalB.createDate).getTime() - new Date(animalA.createDate).getTime(),
            );
    }

    onChange(val: SpecieModel | RaceModel | string | boolean, tag: string): void {
        let idx = 0;
        if (typeof val == 'boolean') {
           this.storedNumbers[0] = val;
        } else if (tag === 'specie') {
            val = val as SpecieModel;
                this.storedNumbers[1] = val.id;
                this.specieService.getSpecieById(val.id).subscribe({
                    next: (specie: SpecieModel) => {
                        this.races = specie.races ?? [];
                    },
                    error: (error) => {
                        console.error(error);
                    }
                });
            
        } else if (tag === 'race') {
            val = val as RaceModel;
                this.storedNumbers[2] = val.id;
        } else {
            val = val as string;
            console.log("init")
            if (tag === 'sex') idx = 3;
            else if (tag === 'age') {
                idx = 4;
            } else console.error('wrong tag');

                this.storedNumbers[idx] = val;
                //console.log(this.storedNumbers[idx])
          
        }
        this.loadFilters();
    }

    loadFilters() {
        console.log(this.storedNumbers)
        let count: number = 0;
        let tag;
        for (let val of this.storedNumbers) {
            switch (count) {
                case 1: {
                    tag = 'specie';
                    break;
                }
                case 2: {
                    tag = 'race';
                    break;
                }
                case 3: {
                    tag = 'sex';
                    break;
                }
                case 4: {
                    tag = 'age';
                    break;
                }
                default:
                    break;
            }
            //console.log(val)
            this.filter(val, tag);
            count++;
        }
    }

    filter(argument: boolean | number | string, tag: string = ''): void {
        //console.log(this.filteredAnimals)
        
        if (typeof argument === 'boolean') 
            this.filteredAnimals = this.animals.filter(
                (animal) => animal.isAdoption === argument
            );
        else if (typeof argument === 'string') {
            if (tag === 'age') {
                if (argument !== '') this.filterListAge(argument);
                //this.checkBoxHandler(this.agesCheckList, argument);
            } else if (tag === 'sex') {
                if (argument !== '')
                    //console.log(argument)
                    this.filteredAnimals = this.filteredAnimals.filter(
                        (animal) => animal.sex === argument
                    );
                //this.checkBoxHandler(this.genderCheckList, argument);
            } else if (argument != '') console.error('wrong tag');
        } else {
          if (tag == 'specie') {
            if (argument !== -1) {
              this.filteredAnimals = this.filteredAnimals.filter(
                (animal) => animal.race.specie.id === argument
              );
              //this.races = [];
            }
            //this.checkBoxHandler(this.speciesCheckList, argument, tag);
          } else if (tag == 'race') {
            console.log(argument)
            if (argument !== -1) {
                console.log(this.filteredAnimals)
              this.filteredAnimals = this.filteredAnimals.filter(
                (animal) => animal.race.id === argument
              );
              console.log(this.filteredAnimals)}
            //this.checkBoxHandler(this.racesCheckList, argument, tag);
          } else console.error('wrong tag');
        }
    }

    

    filterListAge(range: string): void {
        let lowerLimit = new Date();
        let upperLimit = new Date();
        switch (range) {
            case '-2': {
                upperLimit.setFullYear(upperLimit.getFullYear() - 2);
                break;
            }
            case '2 - 5': {
                lowerLimit.setFullYear(lowerLimit.getFullYear() - 2);
                upperLimit.setFullYear(upperLimit.getFullYear() - 5);
                break;
            }
            case '5 - 8': {
                lowerLimit.setFullYear(lowerLimit.getFullYear() - 5);
                upperLimit.setFullYear(upperLimit.getFullYear() - 8);
                break;
            }
            case '8+': {
                lowerLimit.setFullYear(lowerLimit.getFullYear() - 8);
                upperLimit.setFullYear(upperLimit.getFullYear() - 100);
                break;
            }
            default: {
                break;
            }
        }
        this.filteredAnimals = this.filteredAnimals.filter(
            (animal) =>
                new Date(animal.birthDate).getTime() < lowerLimit.getTime() &&
                new Date(animal.birthDate).getTime() > upperLimit.getTime()
        );
    }

    

    private breakPoints() {
      switch(true) {
        case (window.innerWidth <= 730):
          this.valueCols = 1;
          break;
        case (window.innerWidth > 730 && window.innerWidth <= 1020):
          this.valueCols = 2;
          break;
        case (window.innerWidth > 1020 && window.innerWidth <= 1200):
          this.valueCols = 3;
          break;
        default:
          this.valueCols = 4;
      }
  }

  resetFilter(tag: string): void {
    switch (tag) {
        case "specie": {
            this.storedNumbers[1] = -1;
            this.storedNumbers[2] = -1;
            break; 
        }
        case "race": {
            this.storedNumbers[2] = -1;
            break; 
        }
        case "sex": {
            this.storedNumbers[3] = "";
            break; 
        }
        case "age": {
            this.storedNumbers[4] = "";
            break; 
        }
        default:
            break;
    }
    this.loadFilters();
  }

  onResize(): void {
    this.breakPoints();
  }
}

export enum Age {
    newBorn = '-2',
    young = '2 - 5',
    adult = '5 - 8',
    elder = '8+'
}
