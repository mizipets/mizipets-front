import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AnimalsService } from '../../../services/animals.service';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AnimalModel } from 'src/app/models/animal.model';

@Component({
  selector: 'app-animal-delete-modal',
  templateUrl: './animal-delete-modal.component.html',
  styleUrls: ['./animal-delete-modal.component.scss']
})
export class AnimalDeleteModalComponent implements OnInit {

  constructor(
    public deleteAnimalDialog: MatDialogRef<AnimalDeleteModalComponent>,
    private animalService: AnimalsService,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: {animal: AnimalModel}) { }

  ngOnInit(): void {
  }

  openSnackBar(): void {
    this.snackBar.open(
        this.translate.instant('animal.delete-success'),
        '',
        {
            duration: 2000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
        }
    );
  }

  onCancel(): void {
    this.deleteAnimalDialog.close();
  }

  onConfirm(): void {
    this.deleteAnimalDialog.close();
    this.animalService.deleteAdoption(this.data.animal.id).subscribe({
      next: () => {
        this.openSnackBar();
        this.router.navigateByUrl('/animals').then();
      }
    });
  }

}
