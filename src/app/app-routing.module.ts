import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuardService } from './services/auth-guard.service';
import { RegisterComponent } from './components/auth/register/register.component';
import { AnimalsListComponent } from './components/animals/animals-list/animals-list.component';
import { HomeComponent } from './components/home/home.component';
import { AnimalsDetailComponent } from './components/animals/animals-detail/animals-detail.component';
import { MessagesComponent } from './components/messages/messages.component';

const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: 'animals',
        component: AnimalsListComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: 'animal/:id',
        component: AnimalsDetailComponent,
        canActivate: [AuthGuardService]
    },
    {
      path: 'messages',
      component: MessagesComponent,
      canActivate: [AuthGuardService]
    },
    { path: '**', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
