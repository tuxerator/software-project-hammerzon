import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { RootComponent } from './components/root/root.component';
import { AboutComponent } from './components/about/about.component';
import { LandingpageComponent } from './components/landingpage/landingpage.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {AboutMeComponent} from './components/about-me/about-me.component';
import { AllOrdersComponent } from './components/all-orders/all-orders.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { OrderProductComponent } from './components/order-product/order-product.component';
import { PersonalProfileComponent } from './components/personalprofile/personalprofile.component';
import { LoginComponent } from './components/login/login.component';
import { FooterComponent } from './components/footer/footer.component';
import { ProductdetailsComponent } from './components/productdetails/productdetails.component';
import { HeaderComponent } from './components/header/header.component';

@NgModule({
    declarations: [
        RootComponent,
        AboutComponent,
        LandingpageComponent,
        AboutMeComponent,
        FooterComponent,
        AllOrdersComponent,
        RegistrationComponent,
        OrderProductComponent,
        PersonalProfileComponent,
        FooterComponent,
        RegistrationComponent,
        LoginComponent,
        ProductdetailsComponent,
        HeaderComponent
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
