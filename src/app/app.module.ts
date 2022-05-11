import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { LanguageComponent } from './components/language/language.component';
import { LanguageService } from './components/language/language.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {
    HTTP_INTERCEPTORS,
    HttpClient,
    HttpClientModule
} from '@angular/common/http';
import { LoginComponent } from './components/auth/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TokenInterceptor } from './token.interceptor';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { AnimalsListComponent } from './components/animals/animals-list/animals-list.component';
import { HomeComponent } from './components/home/home.component';
import { AnimalsDetailComponent } from './components/animals/animals-detail/animals-detail.component';
import { CodeInputModule } from 'angular-code-input';
import { HomeMobileComponent } from './components/home-mobile/home-mobile.component';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        LanguageComponent,
        LoginComponent,
        DashboardComponent,
        RegisterComponent,
        AnimalsListComponent,
        HomeComponent,
        AnimalsDetailComponent,
        HomeMobileComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        TranslateModule.forRoot({
            defaultLanguage: localStorage.getItem('language') ?? 'fr',
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        MaterialModule,
        HttpClientModule,
        ReactiveFormsModule,
        FormsModule,
        CodeInputModule
    ],
    providers: [
        LanguageService,
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
