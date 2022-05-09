import { Component } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators
} from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Address, Preferences, Shelter } from '../../../models/user.model';
import { RegisterModel } from '../../../models/register.model';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
    next = false;
    check = false;
    countries = [{ value: 'france', display: 'France' }];
    registerForm: FormGroup;
    firstnameCtrl: FormControl;
    lastnameCtrl: FormControl;
    shelterCtrl: FormControl;
    emailCtrl: FormControl;
    passwordCtrl: FormControl;
    streetCtrl: FormControl;
    apartmentCtrl: FormControl;
    zipCtrl: FormControl;
    cityCtrl: FormControl;
    countryCtrl: FormControl;
    errorMessage: string = '';

    constructor(
        public formBuilder: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private snackBar: MatSnackBar
    ) {
        this.firstnameCtrl = formBuilder.control('', [
            Validators.required,
            Validators.minLength(3)
        ]);
        this.lastnameCtrl = formBuilder.control('', [
            Validators.required,
            Validators.minLength(3)
        ]);
        this.shelterCtrl = formBuilder.control('', [
            Validators.required,
            Validators.minLength(3)
        ]);
        this.emailCtrl = formBuilder.control('', [
            Validators.required,
            Validators.email,
            Validators.minLength(3)
        ]);
        this.passwordCtrl = formBuilder.control('', [
            Validators.required,
            Validators.minLength(8)
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

        this.registerForm = formBuilder.group({
            firstname: this.firstnameCtrl,
            lastname: this.lastnameCtrl,
            shelter: this.shelterCtrl,
            email: this.emailCtrl,
            password: this.passwordCtrl,
            street: this.streetCtrl,
            apartment: this.apartmentCtrl,
            zip: this.zipCtrl,
            city: this.cityCtrl,
            country: this.countryCtrl
        });
    }

    openSnackBar(): void {
        this.snackBar.open('register.success', '', {
            duration: 2000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
        });
    }

    onSubmit(): void {
        const preferences: Preferences = {
            lang: localStorage.getItem('language') ?? 'fr',
            darkMode: false,
            notifications: true,
            update: true
        };

        const address: Address = {
            street: this.registerForm.value.street,
            apartment: this.registerForm.value.apartment,
            zip: this.registerForm.value.zip,
            city: this.registerForm.value.city,
            country: this.registerForm.value.country
        };

        const shelter: Shelter = {
            name: this.registerForm.value.shelter
        };

        const registerData: RegisterModel = {
            firstname: this.registerForm.value.firstname,
            lastname: this.registerForm.value.lastname,
            email: this.registerForm.value.email,
            password: this.registerForm.value.password,
            photoUrl: '',
            address,
            shelter,
            preferences
        };

        this.authService.register(registerData).subscribe(() => {
            this.openSnackBar();
            const loginForm = {
                email: this.registerForm.value.email,
                password: this.registerForm.value.password
            };
            this.authService.login(loginForm).subscribe(
                (result) => {
                    localStorage.setItem('token', result.token);
                    this.authService.decodedToken =
                        this.authService.decodeToken(result.token);
                    this.router.navigate(['animals']).then();
                },
                (error) => {
                    this.errorMessage = error.error.message;
                }
            );
        });
    }
}
