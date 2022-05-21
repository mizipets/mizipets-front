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
import { MatDialog } from '@angular/material/dialog';
import { CloseAccountPopUpComponent } from '../close-account-pop-up/close-account-pop-up.component';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  
  profileForm: FormGroup;
  firstnameCtrl: FormControl;
  lastnameCtrl: FormControl;
  emailCtrl: FormControl;
  streetCtrl: FormControl;
  apartmentCtrl: FormControl;
  zipCtrl: FormControl;
  cityCtrl: FormControl;
  countryCtrl: FormControl;
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
    private closeAccountDialog: MatDialog,
    public formBuilder: FormBuilder) {
      this.firstnameCtrl = formBuilder.control('', [
        Validators.required,
        Validators.minLength(3)
      ]);
      this.lastnameCtrl = formBuilder.control('', [
        Validators.required,
        Validators.minLength(3)
      ]);
      this.emailCtrl = formBuilder.control('', [
        Validators.required,
        Validators.email,
        Validators.minLength(3)
    ]);
      this.streetCtrl = formBuilder.control('', Validators.required);
      this.zipCtrl = formBuilder.control('', [
            Validators.required,
            Validators.pattern('^[0-9]*$'),
            Validators.minLength(5),
            Validators.maxLength(5)
      ]);
      this.cityCtrl = formBuilder.control('', Validators.required);
      this.countryCtrl = formBuilder.control('', Validators.required);
      this.apartmentCtrl = formBuilder.control('');
      
      this.profileForm = formBuilder.group({
        firstname: this.firstnameCtrl,
        lastname: this.lastnameCtrl,
        email: this.emailCtrl,
        street: this.streetCtrl,
        apartment: this.apartmentCtrl,
        zip: this.zipCtrl,
        city: this.cityCtrl,
        country: this.countryCtrl
        
    });
     }

  ngOnInit(): void {
    this.isLoading = true;
    this.userService.getUser().subscribe({
      next: (user: UserModel) => {
        this.user = user;
        this.isLoading = false;
        this.profileForm.controls['firstname'].setValue(this.user.firstname);
        this.profileForm.controls['lastname'].setValue(this.user.lastname);
        this.profileForm.controls['email'].setValue(this.user.email);
        this.profileForm.controls['street'].setValue(this.user.address.street);
        this.profileForm.controls['apartment'].setValue(this.user.address?.apartment);
        this.profileForm.controls['zip'].setValue(this.user.address.zip);
        this.profileForm.controls['city'].setValue(this.user.address.city);
        this.profileForm.controls['country'].setValue(this.user.address.country);
      },
      error: (error) => {
        console.error(error);
        this.isLoading = false;
    }
    })
    
  }

  openSnackBar(): void {
    this.snackBar.open('user-profile.update-success', '', {
        duration: 2000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
    });
}

  

  onSubmit(): void {
    // Process checkout data here
    this.user.firstname = this.profileForm.value.firstname,
    this.user.lastname = this.profileForm.value.lastname,
    this.user.email = this.profileForm.value.email,
    this.user.address.street = this.profileForm.value.street,
    this.user.address.apartment = this.profileForm.value.apartment,
    this.user.address.zip = this.profileForm.value.zip,
    this.user.address.city = this.profileForm.value.city,
    this.user.address.country = this.profileForm.value.country

    this.userService.updateUser(this.user).subscribe({
      next: () => {
        this.openSnackBar();
      },
      error: (error) => {
        console.error(error);
    }
    });
  }

  onCloseAccount(): void{
    
    this.closeAccountDialog.open(CloseAccountPopUpComponent)
  }

  

}
