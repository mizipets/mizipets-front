import { Component, OnInit } from '@angular/core';
import { UserModel } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  
  profileForm: FormGroup;
  /**
   * Pass value to true to activate the spinner
   */
  isLoading: boolean = false;
  /**
   * User based on user model
   */
  user = {} as UserModel;

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    public formBuilder: FormBuilder) {
      this.profileForm = formBuilder.group({
        firstname: '',
        lastname: '',
        email: '',
        creatDate: '',
        street: ''
    });
     }

  ngOnInit(): void {
    this.isLoading = true;
    this.userService.getUser().subscribe({
      next: (user: UserModel) => {
        this.user = user;
        this.isLoading = false;
      },
      error: (error) => {
        console.error(error);
        this.isLoading = false;
    }
    })
  }

  openSnackBar(): void {
    this.snackBar.open('update.success', '', {
        duration: 2000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
    });
}

  ngAfterContentInit(): void {
    this.profileForm.setValue({
      firstname: this.user.firstname,
      lastname: this.user.lastname,
      email: this.user.email,
      createDate: this.user.createDate
    })
  }

  onSubmit(): void {
    // Process checkout data here
    this.user.firstname = this.profileForm.value.firstname,
    this.user.lastname = this.profileForm.value.lastname,
    this.user.email = this.profileForm.value.email,
    this.user.address.street = this.profileForm.value.street

    this.userService.updateUser(this.user).subscribe({
      next: () => {
        this.openSnackBar();
      },
      error: (error) => {
        console.error(error);
    }
    });
  }

}
