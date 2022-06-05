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

    checked: boolean = false;

    storedSpecieID: number = -1;

    storedRaceID: number = -1;

    storedGenderID: string = "";

    storedRange: string = "";


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

    Sex: string[] = Object.values(Sex);
    genderCheckList: GenderCheck[] = [];


    races: RaceModel[] = [];
    racesCheckList: RaceCheck[] = [];
    species: SpecieModel[] = [];
    speciesCheckList: SpecieCheck[] = [];
    Age: string[] = Object.values(Age);
    agesCheckList: AgeCheck[] = [];


    constructor(private animalService: AnimalsService,
        private specieService: SpeciesService) {}

    ngOnInit(): void {
        this.isLoading = true;
        const storageValue = localStorage.getItem('valueCols');
        if (storageValue) this.valueCols = parseInt(storageValue);

        this.animalService.getUserAnimals().subscribe({
            next: (animals: AnimalModel[]) => {
                this.animals = animals;
                this.filterList(true);
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
              this.setupSpeciesList(species);
            },
            error: (error) => {
              console.error(error);
            }
        });
        this.setupGenderList();
        this.setupAgeList();
    }

    onSpecieChange(val: SpecieCheck) {
        if (this.storedSpecieID === val.specie.id) {
            this.storedSpecieID = -1;
            this.races = [];
            val.checked = false;
                for (let specieC of this.speciesCheckList) {
                    if (specieC.specie !== val.specie) {
                        specieC.disabled = false;
                    }
                }
            this.filterList(!this.adoptionChecked);
            if (this.storedGenderID !== "")
                this.filterListGender(this.storedGenderID);
            if (this.storedRange !== "")
                this.filterListAge(this.storedRange);
        }
        else {
            this.storedSpecieID = val.specie.id
            this.specieService.getSpecieById(val.specie.id).subscribe({
                next: (specie: SpecieModel) => {
                    this.races = specie.races ?? [];
                    this.setupRacesList(this.races)
                    val.checked = true;
                    for (let specieC of this.speciesCheckList) {
                        if (specieC.specie !== val.specie) {
                            specieC.disabled = true;
                        }
                    this.filterListSpecie(val.specie.id)
                    }
                },
                error: (error) => {
                    console.error(error);
                }
            });
        }
    }

    onRaceChange(val: RaceCheck) {
        if (this.storedRaceID === val.race.id) {
            this.storedRaceID = -1;
            val.checked = false;
                for (let raceC of this.racesCheckList) {
                    if (raceC.race !== val.race) {
                        raceC.disabled = false;
                    }
                }
            this.filterList(!this.adoptionChecked);
            this.filterListSpecie(this.storedSpecieID);
            if (this.storedGenderID !== "")
                this.filterListGender(this.storedGenderID);
            if (this.storedRange !== "")
                this.filterListAge(this.storedRange);
        }
        else {
            this.storedRaceID = val.race.id
            val.checked = true;
            for (let raceC of this.racesCheckList) {
                if (raceC.race !== val.race) {
                    raceC.disabled = true;
                }
            }
            this.filterListRace(val.race.id)
        }
    }

    onGenderChange(val: GenderCheck) {
        if (this.storedGenderID === val.sex) {
            this.storedGenderID = "";
            val.checked = false;
                for (let sexC of this.genderCheckList) {
                    if (sexC.sex !== val.sex) {
                        sexC.disabled = false;
                    }
                }
            this.filterList(!this.adoptionChecked);
            if (this.storedSpecieID !== -1) {
                this.filterListSpecie(this.storedSpecieID);
                if (this.storedRaceID !== -1) {
                    this.filterListRace(this.storedRaceID);
                }
            }
            if (this.storedRange !== "")
                this.filterListAge(this.storedRange);
        }
        else {
            this.storedGenderID = val.sex
            for (let sexC of this.genderCheckList) {
                if (sexC.sex !== val.sex) {
                    sexC.disabled = true;
                }
            }
            this.filterListGender(val.sex);
        }
    }

    onAgeChange(val: AgeCheck) {
        if (this.storedRange === val.range) {
            this.storedRange = "";
            val.checked = false;
                for (let rangeC of this.agesCheckList) {
                    if (rangeC.range !== val.range) {
                        rangeC.disabled = false;
                    }
                }
            this.filterList(!this.adoptionChecked);
            if (this.storedSpecieID !== -1) {
                this.filterListSpecie(this.storedSpecieID);
                if (this.storedRaceID !== -1) {
                    this.filterListRace(this.storedRaceID);
                }
            }
            if (this.storedGenderID !== "")
                this.filterListGender(this.storedGenderID);
        }
        else {
            this.storedRange = val.range
            for (let rangeC of this.agesCheckList) {
                if (rangeC.range !== val.range) {
                    rangeC.disabled = true;
                }
            }
            this.filterListAge(val.range);
        }
    }

    setValueColsToStorage(): number {
        localStorage.setItem('valueCols', this.valueCols.toString());
        return 0;
    }


    filterList(isAdoption: boolean): void {
        this.filteredAnimals = this.animals.filter(
            (animal) => animal.isAdoption === isAdoption
        );
    }

    filterListSpecie(specie: number): void {
        this.filteredAnimals = this.filteredAnimals.filter(
            (animal) => animal.race.specie.id === specie
        );
    }

    filterListRace(race: number): void {
        this.filteredAnimals = this.filteredAnimals.filter(
            (animal) => animal.race.id === race
        );
    }

    filterListGender(sex: string): void {
        this.filteredAnimals = this.filteredAnimals.filter(
            (animal) => (animal.sex === sex)
        );
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

    setupSpeciesList(species: SpecieModel[]) {
        for (let specie of species) {
            let checked = false;
            let disabled = false;
            this.speciesCheckList.push({specie, checked, disabled})
        }
    }

    setupRacesList(races: RaceModel[]) {
        for (let race of races) {
            let checked = false;
            let disabled = false;
            this.racesCheckList.push({race, checked, disabled})
        }
    }

    setupGenderList() {
        for (let sex of this.Sex) {
            let checked = false;
            let disabled = false;
            this.genderCheckList.push({sex, checked, disabled})
        }
    }

    setupAgeList() {
        let checked = false;
        let disabled = false;
        for (let range of this.Age) {
            this.agesCheckList.push({range, checked, disabled})
        }
    }
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

export interface GenderCheck {
    sex: string
    checked: boolean
    disabled: boolean
}

export interface AgeCheck {
    range: string
    checked: boolean
    disabled: boolean
}

export enum Age {
    newBorn = "-2",
    young = "2 - 5",
    adult = "5 - 8",
    elder = "8+"
}
