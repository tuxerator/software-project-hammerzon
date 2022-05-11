import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { RootComponent } from './components/root/root.component';
import { AboutComponent } from './components/about/about.component';
import { LandingpageComponent } from './components/landingpage/landingpage.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {AboutMeComponent} from './components/about-me/about-me.component';
import { FooterComponent } from './components/footer/footer.component';
import { AdminpageComponent } from './components/adminpage/adminpage.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { PersonalProfileComponent } from './components/personalprofile/personalprofile.component';

@NgModule({
    declarations: [
        RootComponent,
        AboutComponent,
        LandingpageComponent,
        AboutMeComponent,
        FooterComponent,
        PersonalProfileComponent,
        FooterComponent,
        AdminpageComponent,
        RegistrationComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule
    ],
    providers: [
        HttpClientModule
    ],
    bootstrap: [RootComponent]
})
export class AppModule { }
