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

  isLoading: boolean = false;

  listo: number[] = [1,2,3,4];

  file: File = {} as File

  fileName: string = "";

  newFileNames: string[] = [];

  newFiles: File[] = [];

  currentImages: string[] = [];

  fileExtension: string = ""

  extensions: string[] = ["jpg", "jpeg", "png", "jfif"];

  update: CreateAdoption = {} as CreateAdoption;

  updated: boolean = false;

  initialImages: string[] = [];
  animal: AnimalModel

  constructor(
    public animalImagesDialog: MatDialogRef<AnimalImagesModalComponent>,
    private snackBar: MatSnackBar,
    private animalService: AnimalsService,
    private translate: TranslateService,
    private s3Service: S3Service,
    @Inject(MAT_DIALOG_DATA) public data: {animal: AnimalModel}) {
      this.animal = Object.assign({}, this.data.animal)
      this.initialImages = [...this.data.animal.images];
    }

  ngOnInit(): void {
  }

  onChange(event: any) {
    if (event.target.files) {
        this.fileExtension = event.target.files[0].name.split('.').pop()!;
        if (this.extensions.indexOf(this.fileExtension!) > -1) {
          var reader = new FileReader();
          this.file = event.target.files[0]
          this.newFiles.push(this.file);
          reader.readAsDataURL(event.target.files[0]);
          reader.onload = (e: any) => {
            this.newFileNames.push(e.target.result);
            this.animal.images.push(e.target.result);
          };
        }
        else {
          this.openSnackBar('common.wrong-image-type');
        }
    }
}

async save(): Promise<void> {
  if (this.currentImages !== this.animal.images && this.currentImages.length > 0) {
    this.isLoading = true
    this.update.images = this.animal.images;
    this.animalService.updateAdoption(this.animal.id, this.update).subscribe({
      next: (animal: AnimalModel) =>{
        this.animal = animal;
        this.initialImages = [...animal.images]
        this.updated = true;
        this.openSnackBar('animal-details.addImage-success');
      },
      error: (error) => {
        this.openSnackBar('animal-details.addImage-error');
      }
    });
  }
  for (let file of this.newFiles) {
    const formData = new FormData();
    formData.append('file', file);
    await this.s3Service
      .uploadImage(this.animal.id, 'animal', formData)
      .subscribe({
        next: (res: any) => {
          this.openSnackBar('animal-details.addImage-success');
        },
        error: (error) => {
          this.openSnackBar('animal-details.addImage-error');
        }
      });
  }
  this.isLoading = false;

}

close() {
  this.data.animal = Object.assign(this.data.animal, this.animal)
  this.animalImagesDialog.close();
}

canSave() {
  return JSON.stringify(this.animal.images) !== JSON.stringify(this.initialImages)
}

openSnackBar(text: string): void {
  this.snackBar.open(
      this.translate.instant(text),
      '',
      {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
      }
  );
}

  onDelete(index: number): void {
    this.currentImages = Object.assign([], this.animal.images);
    this.animal.images.splice(index, 1);
  }
}
