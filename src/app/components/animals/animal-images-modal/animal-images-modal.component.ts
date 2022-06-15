import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AnimalModel, CreateAdoption, Sex} from '../../../models/animal.model';
import { S3Service } from '../../../services/s3.service';
import { AnimalsService } from '../../../services/animals.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-animal-images-modal',
  templateUrl: './animal-images-modal.component.html',
  styleUrls: ['./animal-images-modal.component.scss']
})
export class AnimalImagesModalComponent implements OnInit {

  listo: number[] = [1,2,3,4];

  file: File = {} as File

  fileName: string = "";

  newFileNames: string[] = [];

  newFiles: File[] = [];

  currentImages: string[] = [];

  update: CreateAdoption = {} as CreateAdoption;

  updated: boolean = false;

  constructor(
    public animalImagesDialog: MatDialogRef<AnimalImagesModalComponent>,
    private snackBar: MatSnackBar,
    private animalService: AnimalsService,
    private translate: TranslateService,
    private s3Service: S3Service,
    @Inject(MAT_DIALOG_DATA) public data: {animal: AnimalModel}) { }

  ngOnInit(): void {
    this.currentImages = this.data.animal.images;
  }

  onChange(event: any) {
    if (event.target.files) {
        var reader = new FileReader();
        this.file = event.target.files[0]
        this.newFiles.push(this.file);
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (e: any) => {
            this.newFileNames.push(e.target.result);
            this.data.animal.images.push(e.target.result);
        };

        
    }
}

onLeave(): void {
  console.log(this.file);
  console.log(this.newFiles);
  if (this.currentImages != this.data.animal.images) {
    this.update.images = this.data.animal.images;
  this.animalService.updateAdoption(this.data.animal.id, this.update).subscribe({
    next: (animal: AnimalModel) =>{
      this.data.animal = animal;
      this.updated = true;
    },
    error: (error) => {
      console.error(error);
    }
  });
  }
  for (let file of this.newFiles) {
    let formData = new FormData();
    console.log(file);
    formData.append('file', file);
      this.s3Service
        .uploadImage(this.data.animal.id, 'animal', formData)
        .subscribe({
          next: (_) => {
            this.openSnackBar();
          },
          error: (error) => {
            console.error(error);
          }
        });
  }
  this.animalImagesDialog.close();
}

openSnackBar(): void {
  this.snackBar.open(
      this.translate.instant('user-profile.update-success'),
      '',
      {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
      }
  );
}

  onDelete(index: number): void {
    console.log(index);
    this.data.animal.images.splice(index, 1);
    console.log(this.data.animal.images);
  }
}
