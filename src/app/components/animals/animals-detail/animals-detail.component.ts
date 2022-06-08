import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnimalModel} from '../../../models/animal.model';

@Component({
    selector: 'app-animals-detail',
    templateUrl: './animals-detail.component.html',
    styleUrls: ['./animals-detail.component.scss']
})
export class AnimalsDetailComponent implements OnInit {

    animal: AnimalModel = {} as AnimalModel;

    age: number = 0;

    ageString: string = "";

    /**
     * Checkbox to define animal as top priority
     */
    urgentChecked: boolean = false;

    constructor(
        private router: Router) {

        }

    ngOnInit(): void {
        this.animal = history.state;
        console.log(this.animal);
        this.age = new Date().getFullYear()  - new Date(this.animal.birthDate).getFullYear();
        if (this.age === 0) this.ageString = "<1";
        else this.ageString = this.age.toString();
        console.log(this.ageString)
    }
}
