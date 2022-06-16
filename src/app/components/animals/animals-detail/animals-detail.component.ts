import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Route, Router } from "@angular/router";
import { AnimalModel, CreateAdoption, Sex} from '../../../models/animal.model';
import { SpecieModel } from '../../../models/specie.model';
import { RaceModel } from '../../../models/race.model';
import { S3Service } from '../../../services/s3.service';
import { SpeciesService } from '../../../services/species.service';
import { AnimalsService } from '../../../services/animals.service';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AnimalDeleteModalComponent } from '../animal-delete-modal/animal-delete-modal.component';
import { AnimalImagesModalComponent } from '../animal-images-modal/animal-images-modal.component';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import SwiperCore, { Autoplay, Pagination, Navigation } from "swiper";

SwiperCore.use([Autoplay, Pagination, Navigation]);

@Component({
    selector: 'app-animals-detail',
    templateUrl: './animals-detail.component.html',
    styleUrls: ['./animals-detail.component.scss'],
})
export class AnimalsDetailComponent implements OnInit {
    modify: boolean = false;

    file: File = {} as File;

    fileName: string[] = [];

    displayedImage: string = "";

    today: Date = new Date();

    newImage: boolean = false;

    animal: AnimalModel = {} as AnimalModel;

    updateAnimal: CreateAdoption = {} as CreateAdoption;

    age: number = 0;

    ageString: string = "";

    Sex: string[] = Object.values(Sex);

    races: RaceModel[] = [];

    nameCtrl: FormControl = this.formBuilder.control('', [
        Validators.required,
        Validators.minLength(3)
    ]);

    commentCtrl: FormControl = this.formBuilder.control('');

    birthDateCtrl: FormControl = this.formBuilder.control(
        '',
        Validators.required
    );

    sexCtrl: FormControl = this.formBuilder.control('', Validators.required);

    raceCtrl: FormControl = this.formBuilder.control('', Validators.required);

    animalForm = this.formBuilder.group({
        name: this.nameCtrl,
        comment: this.commentCtrl,
        birthDate: this.birthDateCtrl,
        sex: this.sexCtrl,
        race: this.raceCtrl
    });

    constructor(
        private router: Router,
        private deleteAnimalDialog: MatDialog,
        private animalImagesDialog: MatDialog,
        public formBuilder: FormBuilder,
        private snackBar: MatSnackBar,
        private translate: TranslateService,
        private animalService: AnimalsService,
        private specieService: SpeciesService,
        private s3Service: S3Service,
        private route: ActivatedRoute) {}

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get("id");
        //@TODO ajouter le call api get animal by id

        this.animal = history.state;
        this.age = new Date().getFullYear()  - new Date(this.animal.birthDate).getFullYear();
        if (this.age === 0) this.ageString = "<1";
        else this.ageString = this.age.toString();
        this.specieService.getSpecieById(this.animal.race.specie.id).subscribe({
            next: (specie: SpecieModel) => {
                this.races = specie.races ?? [];
            },
            error: (error) => {
                console.error(error);
            }
        });
        this.fileName = this.animal.images;
        this.displayedImage = this.animal.images[0];
        this.animalForm.controls['name'].setValue(this.animal.name);
        this.animalForm.controls['sex'].setValue(this.animal.sex);
        this.animalForm.controls['birthDate'].setValue(this.animal.birthDate);
        this.animalForm.controls['race'].setValue(this.animal.race);
        this.animalForm.controls['comment'].setValue(this.animal.comment);
    }


    onUpdateButton(): void {
        this.modify = !this.modify;
        this.fileName = this.animal.images
    }

    onUpdate(): void {
        this.updateAnimal.name = this.animalForm.value.name;
        this.updateAnimal.comment = this.animalForm.value.comment;
        this.updateAnimal.birthDate = this.animalForm.value.birthDate;
        this.updateAnimal.sex = this.animalForm.value.sex;
        this.updateAnimal.raceId = this.animalForm.value.race.id;

        this.animalService.updateAdoption(this.animal.id, this.updateAnimal).subscribe({
            next: (animal: AnimalModel) => {
                this.animal = animal;
                if (this.fileName !== this.animal.images) {
                    const formData = new FormData();
                    formData.append('file', this.file);
                    this.s3Service
                        .uploadImage(animal.id, 'animal', formData)
                        .subscribe({
                            next: () => {
                                this.openSnackBar('animal-details.addImage-success');
                                this.modify = true;
                            },
                            error: (error) => {
                                console.error(error);
                                this.openSnackBar('animal-add.image-error');
                            }
                        });
                }
                this.modify = false;
            },
            error: (error) => {
                console.error(error);
                this.openSnackBar('animals-add.animal-error');
            }
        })
    }


    onChange(event: any) {
        if (event.target.files) {
            let reader = new FileReader();
            this.file = event.target.files[0];
            reader.readAsDataURL(this.file);
            reader.onload = (e: any) => {
                this.displayedImage = e.target.result;
            };
            this.newImage = true;

        }
    }

    onDeleteAnimal(): void {
        this.deleteAnimalDialog.open(AnimalDeleteModalComponent, {
            data: { animal: this.animal },
        });
    }

    onImages(): void {
        this.animalImagesDialog.open(AnimalImagesModalComponent, {
            data: { animal: this.animal },
            height: '100vh',
            width: '100%'
        });
    }

    openSnackBar(text: string): void {
        this.snackBar.open(this.translate.instant(text), '', {
            duration: 2000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
        });
    }
}
