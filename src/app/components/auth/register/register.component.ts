import { Component } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../services/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  hide = true;
  next = false;
  check = false;
  countries = [
    {value: 'france', display: 'France'}
  ]
  registerForm: FormGroup;
  firstnameCtrl: FormControl;
  lastnameCtrl: FormControl;
  shelterCtrl: FormControl;
  emailCtrl: FormControl;
  passwordCtrl: FormControl;
  errorMessage: string = '';

  constructor(
    public formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.firstnameCtrl = formBuilder.control('', Validators.required);
    this.lastnameCtrl = formBuilder.control('', Validators.required);
    this.shelterCtrl = formBuilder.control('', Validators.required);
    this.emailCtrl = formBuilder.control('', Validators.required);
    this.passwordCtrl = formBuilder.control('', Validators.required);

    this.registerForm = formBuilder.group({
      firstname: this.firstnameCtrl,
      lastname: this.lastnameCtrl,
      shelter: this.shelterCtrl,
      email: this.emailCtrl,
      password: this.passwordCtrl
    });
  }

  openSnackBar(): void {
    this.snackBar.open('register.success', '', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  onSubmit(): void {
    console.log(this.registerForm.value)
    // this.authService.register(this.accountForm.value).subscribe(() => {
    //   this.openSnackBar();
    //   const loginForm = {
    //     email: this.accountForm.value.email,
    //     password: this.accountForm.value.password
    //   };
    //   this.authService.login(loginForm).subscribe(result => {
    //     localStorage.setItem('token', result.token);
    //     this.authService.decodedToken = this.authService.decodeToken(result.token);
    //     this.router.navigate(['dashboard']).then();
    //   }, (error) => {
    //     this.errorMessage = error.error.message;
    //   });
    // });
  }
}
