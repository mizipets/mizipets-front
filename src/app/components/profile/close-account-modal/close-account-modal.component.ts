import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from '../../../services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-close-account-modal',
    templateUrl: './close-account-modal.component.html',
    styleUrls: ['./close-account-modal.component.scss']
})
export class CloseAccountModalComponent {
    constructor(
        public closeAccountDialog: MatDialogRef<CloseAccountModalComponent>,
        private userService: UserService,
        public authService: AuthService,
        private translate: TranslateService,
        private snackBar: MatSnackBar
    ) {}

    openSnackBar(): void {
        this.snackBar.open(
            this.translate.instant('profile.close-success'),
            '',
            {
                duration: 2000,
                horizontalPosition: 'center',
                verticalPosition: 'top'
            }
        );
    }

    onCancel(): void {
        this.closeAccountDialog.close();
    }

    onConfirm(): void {
        this.closeAccountDialog.close();
        this.userService.closeUser().subscribe({});
        this.authService.logout();
        this.openSnackBar();
    }
}
