import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { RaceModel } from '../../../models/race.model';
import { SpecieModel } from '../../../models/specie.model';
import { SpeciesService } from '../../../services/species.service';
import { AnimalsService } from '../../../services/animals.service';
import { S3Service } from '../../../services/s3.service';
import { AnimalModel, CreateAdoption, Sex } from '../../../models/animal.model';

@Component({
    selector: 'app-animals-create',
    templateUrl: './animals-create.component.html',
    styleUrls: ['./animals-create.component.scss']
})
export class AnimalsCreateComponent implements OnInit {
    isLoading: boolean = false;

    newImage: boolean = false;

    next = false;

    file: File = {} as File;

    fileExtension: string = ""

    extensions: string[] = ["jpg", "jpeg", "png", "jfif"];

    today: Date = new Date();

    fileName = './assets/images/logo.png';

    newAnimal: CreateAdoption = {} as CreateAdoption;

    Sex: string[] = Object.values(Sex);

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

    specieCtrl: FormControl = this.formBuilder.control('', Validators.required);

    raceCtrl: FormControl = this.formBuilder.control('', Validators.required);

    animalForm = this.formBuilder.group({
        name: this.nameCtrl,
        comment: this.commentCtrl,
        birthDate: this.birthDateCtrl,
        sex: this.sexCtrl,
        specie: this.specieCtrl,
        race: this.raceCtrl
    });

    races: RaceModel[] = [];
    species: SpecieModel[] = [];

    constructor(
        public formBuilder: FormBuilder,
        private snackBar: MatSnackBar,
        private translate: TranslateService,
        private router: Router,
        private animalService: AnimalsService,
        private specieService: SpeciesService,
        private s3Service: S3Service
    ) {}

    ngOnInit(): void {
        this.specieService.getSpecies().subscribe({
            next: (species: SpecieModel[]) => {
                this.species = species;
            },
            error: (error) => {
                console.error(error);
            }
        });
    }

    onSpecieChange(event: any) {
        this.specieService.getSpecieById(event.value.id).subscribe({
            next: (specie: SpecieModel) => {
                this.races = specie.races ?? [];
            },
            error: (error) => {
                console.error(error);
            }
        });
    }

    onSubmit() {
        this.isLoading = true;
        this.newAnimal.name = this.animalForm.value.name;
        this.newAnimal.comment = this.animalForm.value.comment;
        this.newAnimal.birthDate = this.animalForm.value.birthDate;
        this.newAnimal.sex = this.animalForm.value.sex;
        this.newAnimal.raceId = this.animalForm.value.race.id;

        this.animalService.createAdoption(this.newAnimal).subscribe({
            next: (animal: AnimalModel) => {
                const formData = new FormData();
                formData.append('file', this.file);
                this.s3Service
                    .uploadImage(animal.id, 'animal', formData)
                    .subscribe({
                        next: () => {
                            this.openSnackBar('animals-add.button');
                            this.isLoading = false;
                            this.router.navigateByUrl('/animals').then();
                        },
                        error: (error) => {
                            console.error(error);
                            this.isLoading = false;
                            this.openSnackBar('animals-add.image-error');
                        }
                    });
            },
            error: (error) => {
                console.error(error);
                this.isLoading = false;
                this.openSnackBar('animals-add.animal-error');
            }
        });
    }

    onChange(event: any) {
        this.newImage = false;
        if (event.target.files) {
            this.fileExtension = event.target.files[0].name.split('.').pop()!;
            if (this.extensions.indexOf(this.fileExtension!) > -1) {
                let reader = new FileReader();
                this.file = event.target.files[0];
                reader.readAsDataURL(this.file);
                reader.onload = (e: any) => {
                    this.fileName = e.target.result;
                };
                this.newImage = true;
            }
        }
        else {
            this.openSnackBar('common.wrong-image-type');
        }
    }

    async delay(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    onNext() {
        this.next = true;
    }

    onBack() {
        this.next = false;
    }

    openSnackBar(text: string): void {
        this.snackBar.open(this.translate.instant(text), '', {
            duration: 2000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
        });
    }
}
