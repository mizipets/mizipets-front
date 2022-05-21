import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-close-account-pop-up',
  templateUrl: './close-account-pop-up.component.html',
  styleUrls: ['./close-account-pop-up.component.scss']
})
export class CloseAccountPopUpComponent implements OnInit {

  constructor(
    public closeAccountDialog: MatDialogRef<CloseAccountPopUpComponent>,
    private userService: UserService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
  }

  onCancel(): void {
    this.closeAccountDialog.close();
  }

  onConfirm(): void {
    this.closeAccountDialog.close();
    this.userService.closeUser().subscribe({});
    this.authService.logout();
  }
  
}
