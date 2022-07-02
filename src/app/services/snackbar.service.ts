import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class SnackbarService {
    constructor(private snackBar: MatSnackBar) {}

    openSuccess(message: string): void {
        this.snackBar.open(message, '', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
        });
    }

    openError(message: string, showSupportMsg: boolean = true): void {
        this.snackBar.open(message, '', {
            duration: 3000,
            panelClass: ['error-snackbar'],
            horizontalPosition: 'center',
            verticalPosition: 'top'
        });
    }
}
