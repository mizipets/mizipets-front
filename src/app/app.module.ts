import { Injectable, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/layout/header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { MatRadioModule } from '@angular/material/radio';
import { LanguageComponent } from './components/language/language.component';
import { LanguageService } from './services/language.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SwiperModule } from 'swiper/angular';
import {
    HTTP_INTERCEPTORS,
    HttpClient,
    HttpClientModule
} from '@angular/common/http';
import { LoginComponent } from './components/auth/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TokenInterceptor } from './token.interceptor';
import { RegisterComponent } from './components/auth/register/register.component';
import { AnimalsListComponent } from './components/animals/animals-list/animals-list.component';
import { HomeComponent } from './components/home/home.component';
import { AnimalsDetailComponent } from './components/animals/animals-detail/animals-detail.component';
import { CodeInputModule } from 'angular-code-input';
import { HomeMobileComponent } from './components/home/home-mobile/home-mobile.component';
import { NotFoundComponent } from './components/layout/not-found/not-found.component';
import { MessagesComponent } from './components/messages/messages.component';
import { environment } from '../environments/environment';
import { SocketIoModule, Socket } from 'ngx-socket-io';
import { UserProfileComponent } from './components/profile/user-profile.component';
import { SettingsComponent } from './components/profile/settings/settings.component';
import { CloseAccountModalComponent } from './components/profile/close-account-modal/close-account-modal.component';
import { AnimalsCreateComponent } from './components/animals/animals-create/animals-create.component';
import { AnimalDeleteModalComponent } from './components/animals/animal-delete-modal/animal-delete-modal.component';
import { AnimalImagesModalComponent } from './components/animals/animal-images-modal/animal-images-modal.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { PoliciesComponent } from './components/policies/policies.component';
import { SnackbarService } from './services/snackbar.service';
import { AuthService } from "./services/auth.service";

@Injectable()
export class RoomSocket extends Socket {
  constructor() {
    super(
        {
            url: environment.roomSocketUrl,
            options: {
                transports: ['websocket'],
            }
        }
    );
  }
}

@Injectable()
export class NotificationSocket extends Socket {
  constructor() {
    super(
        {
            url: environment.notificationsSocketUrl,
            options: {
                transports: ['websocket'],
            }
        }
    );
  }
}

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        LanguageComponent,
        LoginComponent,
        RegisterComponent,
        AnimalsListComponent,
        AnimalsDetailComponent,
        MessagesComponent,
        HomeComponent,
        HomeMobileComponent,
        NotFoundComponent,
        UserProfileComponent,
        SettingsComponent,
        CloseAccountModalComponent,
        AnimalsCreateComponent,
        AnimalDeleteModalComponent,
        AnimalImagesModalComponent,
        FooterComponent,
        PoliciesComponent
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
        SocketIoModule,
        MaterialModule,
        MatRadioModule,
        HttpClientModule,
        ReactiveFormsModule,
        FormsModule,
        CodeInputModule,
        SwiperModule
    ],
    providers: [
        SnackbarService,
        NotificationSocket,
        RoomSocket,
        LanguageService,
        AuthService,
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
