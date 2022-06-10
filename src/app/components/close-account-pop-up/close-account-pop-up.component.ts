import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from '../../services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-close-account-pop-up',
    templateUrl: './close-account-pop-up.component.html',
    styleUrls: ['./close-account-pop-up.component.scss']
})
export class CloseAccountPopUpComponent implements OnInit {
    constructor(
        public closeAccountDialog: MatDialogRef<CloseAccountPopUpComponent>,
        private userService: UserService,
        public authService: AuthService,
        private translate: TranslateService,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {}

    openSnackBar(): void {
        this.snackBar.open(
            this.translate.instant('user-profile.close-success'),
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
