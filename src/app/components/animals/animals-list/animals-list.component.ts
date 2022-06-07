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
     * All checkbox id checked, -1 or "" if all checkbox are unchecked
     */
    storedNumbers: Array<number | string> = [-1, -1, "", ""];

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

    /**
     * Sex enum as string list
     */
    Sex: string[] = Object.values(Sex);

    /**
     * Age enum as string list
     */
    Age: string[] = Object.values(Age);

    /**
     * Gender checkbox list
     */
    genderCheckList: TypeCheck[] = [];

    /**
     * Age checkbox list
     */
    agesCheckList: TypeCheck[] = [];

    /**
     * Species list
     */
    species: SpecieModel[] = [];

    /**
     * Species checkbox list
     */
    speciesCheckList: SpecieCheck[] = [];

    /**
     * Races list, empty until a specie is setted
     */
    races: RaceModel[] = [];

    /**
     * Races checkbox list
     */
    racesCheckList: RaceCheck[] = [];


    constructor(private animalService: AnimalsService,
        private specieService: SpeciesService) {}

    ngOnInit(): void {
        this.isLoading = true;
        const storageValue = localStorage.getItem('valueCols');
        if (storageValue) this.valueCols = parseInt(storageValue);

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
              this.setupList(species, "specie");
            },
            error: (error) => {
              console.error(error);
            }
        });
        this.setupList("", "sex");
        this.setupList("", "age");
    }

    onChange (val: SpecieCheck | RaceCheck | TypeCheck, tag: string): void {
        let idx = 0;   
        if (tag === "specie") {
            val = val as SpecieCheck;
            if (this.storedNumbers[0] === -1) {
                this.storedNumbers[0] = val.specie.id;
                console.log(this.storedNumbers[0])
                this.specieService.getSpecieById(val.specie.id).subscribe({
                    next: (specie: SpecieModel) => {
                        val = val as SpecieCheck;
                        this.races = specie.races ?? [];
                        this.setupList(this.races, "race")
                    },
                    error: (error) => {
                        console.error(error);
                    }
                });
            }
            else 
                this.storedNumbers[0] = -1;
                this.racesCheckList = [];
        }

        else if (tag === "race") {
            val = val as RaceCheck;
            if (this.storedNumbers[1] === -1)
                this.storedNumbers[1] = val.race.id;
            else 
                this.storedNumbers[1] = -1;
        }

        else {
            val = val as TypeCheck;
            
            if (tag === "sex") 
                idx = 2;

            else if (tag === "age") {
                idx = 3;
            }
            else console.error("wrong tag");

            if (this.storedNumbers[idx] === "")
                this.storedNumbers[idx] = val.type as string;
            else 
                this.storedNumbers[idx] = "";
        }

        this.loadFilters(this.storedNumbers);

    }

    loadFilters(numbers: Array<number | string>) {
        this.filter(!this.adoptionChecked);
        let count: number = 0;
        let tag;
        for (let val of numbers) {
            switch (count) {
                case 0: {
                    tag = "specie";
                    break;
                }
                case 1: {
                    tag = "race";
                    break;
                }
                case 2: {
                    tag = "sex";
                    break;
                }
                case 3: {
                    tag = "age";
                    break;
                }
                default: break;
            }
            this.filter(val, tag)
            count++;
        }
        
    }

    setValueColsToStorage(): number {
        localStorage.setItem('valueCols', this.valueCols.toString());
        return 0;
    }

    filter(argument: boolean | number | string, tag: string = ""): void {
        if (typeof argument === 'boolean')
            this.filteredAnimals = this.animals.filter(
                (animal) => animal.isAdoption === argument
            );

        else if (typeof argument === 'string' ) {
            if (tag === 'age') {
                if (argument != "")
                    this.filterListAge(argument);
                this.checkBoxHandler(this.agesCheckList, argument);
            }

            else if (tag === 'sex') {
                if (argument != "")
                    this.filteredAnimals = this.filteredAnimals.filter(
                        (animal) => (animal.sex === argument)
                    );
                this.checkBoxHandler(this.genderCheckList, argument);
            }
            else if (argument != "") console.error("wrong tag");

            
            
        }
        else if (typeof argument === 'number')
            if (tag == "specie") {
                if (argument != -1)
                    this.filteredAnimals = this.filteredAnimals.filter(
                        (animal) => animal.race.specie.id === argument
                    );
                console.log(tag)    
                this.checkBoxHandler(this.speciesCheckList, argument, tag); 
            }

            else if (tag == "race") {
                if (argument != -1)
                    this.filteredAnimals = this.filteredAnimals.filter(
                        (animal) => animal.race.id === argument
                    );
                this.checkBoxHandler(this.racesCheckList, argument, tag); 
            }
                

            else console.error("wrong tag")

    }

    checkBoxHandler(list: SpecieCheck[] | RaceCheck[] | TypeCheck[], id : number | string, tag: string = ""): void {
        if (typeof id === 'number') {
            if (id != -1) {            
                if (tag === "specie") {
                    list = list as SpecieCheck[];
                    for (let value of list) {
                        if (value.specie.id === id) {
                            value.disabled = false;
                        }
                        else {
                            value.checked = false;
                            value.disabled = true;
                        } 
                    }
            
                }
                else if (tag === "race") {
                    list = list as RaceCheck[];
                    for (let value of list) {
                        if (value.race.id === id) {
                            value.disabled = false;
                        }
                        else {
                            value.checked = false;
                            value.disabled = true;
                        } 
                    }
                }
            }
            else {
                for (let value of list) {
                        value.checked = false;
                        value.disabled = false;
                }
            }
        }
        else {
            list = list as TypeCheck[]
            if (id != "") {
                for (let value of list) {
                    if (value.type as string === id) {
                        value.disabled = false;
                    }
                    else {
                        value.checked = false;
                        value.disabled = true;
                    } 
                }
            }
            else {
                for (let value of list) {
                        value.checked = false;
                        value.disabled = false;
                }
            }
        }
    }

    filterListAge(range: string): void {
        let lowerLimit = new Date();
        let upperLimit = new Date();
        switch(range) {
            case "-2": {
                upperLimit.setFullYear(upperLimit.getFullYear() - 2);
                break;
            }
            case "2 - 5": {
                lowerLimit.setFullYear(lowerLimit.getFullYear() - 2);
                upperLimit.setFullYear(upperLimit.getFullYear() - 5);
                break;
            }
            case "5 - 8": {
                lowerLimit.setFullYear(lowerLimit.getFullYear() - 5);
                upperLimit.setFullYear(upperLimit.getFullYear() - 8);
                break;
            }
            case "8+": {
                lowerLimit.setFullYear(lowerLimit.getFullYear() - 8);
                upperLimit.setFullYear(upperLimit.getFullYear() - 100);
                break;
            }
            default: {
                break;
            }
        }
        this.filteredAnimals = this.filteredAnimals.filter(
            (animal) => (new Date(animal.birthDate).getTime() < lowerLimit.getTime()) && (new Date(animal.birthDate).getTime() > upperLimit.getTime())
        );
    }

    setupList(type: SpecieModel[] | RaceModel[] | string, tag: string): void {
        let checked = false;
        let disabled = false;
        if (typeof type === 'string') {
            if (tag === "age")
                for (let type of this.Age) 
                    this.agesCheckList.push({type, checked, disabled});

            else if (tag === "sex")
                for (let type of this.Sex)                 
                    this.genderCheckList.push({type, checked, disabled});

            else console.error("wrong tag")
        }
        else {
            if (tag === "specie")
                for (let specie of type as SpecieModel[]) 
                this.speciesCheckList.push({specie, checked, disabled});

            else if (tag === "race")
                for (let race of type as RaceModel[])                 
                    this.racesCheckList.push({race, checked, disabled});

            else console.error("wrong tag")
        }
    }
}

export interface TypeCheck {
    type: SpecieModel | RaceModel | string
    checked: boolean
    disabled: boolean
}

export interface SpecieCheck {
    specie: SpecieModel
    checked: boolean
    disabled: boolean
}

export interface RaceCheck {
    race: RaceModel
    checked: boolean
    disabled: boolean
}

export enum Age {
    newBorn = "-2",
    young = "2 - 5",
    adult = "5 - 8",
    elder = "8+"
}
