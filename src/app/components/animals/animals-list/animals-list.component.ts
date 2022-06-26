import { Component, OnInit } from '@angular/core';
import { AnimalsService } from '../../../services/animals.service';
import { AnimalModel, Sex } from '../../../models/animal.model';
import { RaceModel } from '../../../models/race.model';
import { SpecieModel } from '../../../models/specie.model';
import { SpeciesService } from '../../../services/species.service';
import { AuthService } from '../../../services/auth.service';

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
    isAdoptionChecked: boolean = false;
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
     * Selected values
     */
    selectedSpecie: string = '';
    selectedRace: string = '';
    selectedGender: string = '';
    selectedAge: string = '';
    /**
     * Sex enum as string list
     */
    sex: string[] = Object.values(Sex);
    /**
     * Age enum as string list
     */
    ages: string[] = ['-2', '2 - 5', '5 - 8', '8+'];
    /**
     * Species list
     */
    species: SpecieModel[] = [];
    /**
     * Races list, empty until a specie is set
     */
    races: RaceModel[] = [];

    constructor(
        private animalService: AnimalsService,
        private specieService: SpeciesService,
        private authService: AuthService
    ) {}

    ngOnInit(): void {
        this.breakPoints();
        this.getUserAnimals();
    }

    orderList(): AnimalModel[] {
        return this.filteredAnimals.sort(
            (animalA, animalB) =>
                new Date(animalB.createDate).getTime() -
                new Date(animalA.createDate).getTime()
        );
    }

    getRace(id: number): void {
        this.selectedRace = '';
        this.specieService.getSpecieById(id).subscribe({
            next: (specie: SpecieModel) => {
                this.races = specie.races!;
            },
            error: (error) => {
                console.error(error);
            }
        });
    }

    onChange(): void {
        // parent filter define the list
        this.filteredAnimals = this.isAdoptionChecked
            ? this.animals.filter((animal) => !animal.isAdoption)
            : this.animals.filter((animal) => animal.isAdoption);

        // children filters to sort the list
        if (this.selectedSpecie !== '')
            this.filteredAnimals = this.filteredAnimals.filter(
                (animal) => animal.race.specie.name === this.selectedSpecie
            );
        if (this.selectedRace !== '')
            this.filteredAnimals = this.filteredAnimals.filter(
                (animal) => animal.race.name === this.selectedRace
            );
        if (this.selectedGender !== '')
            this.filteredAnimals = this.filteredAnimals.filter(
                (animal) => animal.sex === this.selectedGender
            );
        if (this.selectedAge !== '') {
            this.filterListAge(this.selectedAge);
        }
    }

    resetFilter(): void {
        this.selectedSpecie = '';
        this.selectedRace = '';
        this.selectedGender = '';
        this.selectedAge = '';
        this.isAdoptionChecked = false;
        this.races = [];
        this.filteredAnimals = this.animals.filter(
            (animal) => animal.isAdoption
        );
    }

    onResize(): void {
        this.breakPoints();
    }

    private getUserAnimals(): void {
        this.isLoading = true;
        this.animalService.getUserAnimals().subscribe({
            next: (animals: AnimalModel[]) => {
                // remove owner animals which are not for adoption
                this.animals = animals.filter(
                    (animal) =>
                        !(
                            !animal.isAdoption &&
                            animal.owner.id ===
                                this.authService.decodedToken?.id
                        )
                );
                this.filteredAnimals = this.animals.filter(
                    (animal) => animal.isAdoption
                );
                this.getSpecies();
                this.isLoading = false;
            },
            error: (error) => {
                console.error(error);
                this.isLoading = false;
            }
        });
    }

    private filterListAge(range: string): void {
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
        }
        this.filteredAnimals = this.filteredAnimals.filter(
            (animal) =>
                new Date(animal.birthDate).getTime() < lowerLimit.getTime() &&
                new Date(animal.birthDate).getTime() > upperLimit.getTime()
        );
    }

    private getSpecies(): void {
        this.specieService.getSpecies().subscribe({
            next: (species: SpecieModel[]) => {
                this.species = species;
            },
            error: (error) => {
                console.error(error);
            }
        });
    }

    private breakPoints() {
        switch (true) {
            case window.innerWidth <= 730:
                this.valueCols = 1;
                break;
            case window.innerWidth > 730 && window.innerWidth <= 1020:
                this.valueCols = 2;
                break;
            case window.innerWidth > 1020 && window.innerWidth <= 1200:
                this.valueCols = 3;
                break;
            default:
                this.valueCols = 4;
        }
    }
}
