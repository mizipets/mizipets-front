import { Component, OnInit } from '@angular/core';
import { DeviceDetectorService } from "ngx-device-detector";
import { AnimalsService } from "../../services/animals.service";
import { AnimalModel } from "../../models/animal.model";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    isMobileDevice: boolean = false;
    animals: AnimalModel[] = [];

    constructor(
      private deviceService: DeviceDetectorService,
      private animalService: AnimalsService
    ) {}

    ngOnInit(): void {
        this.isMobileDevice = this.deviceService.isMobile() || this.deviceService.isTablet();
        this.animalService.getFetchedAnimal().subscribe((animals: AnimalModel[]) => this.animals = animals);
    }
}
