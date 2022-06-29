import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { AuthGuardService } from './services/auth-guard.service';
import { RegisterComponent } from './components/auth/register/register.component';
import { AnimalsListComponent } from './components/animals/animals-list/animals-list.component';
import { HomeComponent } from './components/home/home.component';
import { AnimalsDetailComponent } from './components/animals/animals-detail/animals-detail.component';
import { MessagesComponent } from './components/messages/messages.component';
import { UserProfileComponent } from './components/profile/user-profile.component';
import { SettingsComponent } from './components/profile/settings/settings.component';
import { NotFoundComponent } from './components/layout/not-found/not-found.component';
import { AnimalsCreateComponent } from './components/animals/animals-create/animals-create.component';
import { PoliciesComponent } from './components/policies/policies.component';
import { MobileGuardService } from './services/mobile-guard.service';

const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'policies', component: PoliciesComponent },
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [MobileGuardService]
    },
    {
        path: 'register',
        component: RegisterComponent,
        canActivate: [MobileGuardService]
    },
    {
        path: 'animals',
        component: AnimalsListComponent,
        canActivate: [AuthGuardService, MobileGuardService]
    },
    {
        path: 'animal/:id',
        component: AnimalsDetailComponent,
        canActivate: [AuthGuardService, MobileGuardService]
    },
    {
        path: 'animal-create',
        component: AnimalsCreateComponent,
        canActivate: [AuthGuardService, MobileGuardService]
    },
    {
        path: 'messages',
        component: MessagesComponent,
        canActivate: [AuthGuardService, MobileGuardService]
    },
    {
        path: 'user',
        component: UserProfileComponent,
        canActivate: [AuthGuardService, MobileGuardService]
    },
    {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [AuthGuardService, MobileGuardService]
    },
    { path: '**', pathMatch: 'full', component: NotFoundComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
