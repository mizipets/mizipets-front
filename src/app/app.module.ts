import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { LanguageComponent } from './components/language/language.component';
import { LanguageService } from './components/language/language.service';

@NgModule({
  declarations: [AppComponent, HeaderComponent, LanguageComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
  ],
  providers: [LanguageService],
  bootstrap: [AppComponent],
})
export class AppModule {}
