import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { RootComponent } from './components/root/root.component';
import { AboutComponent } from './components/about/about.component';
import { LandingpageComponent } from './components/landingpage/landingpage.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AboutMeComponent } from './components/about-me/about-me.component';
import { AllOrdersComponent } from './components/all-orders/all-orders.component';
import { FooterComponent } from './components/footer/footer.component';
import { PersonalProfileComponent } from './components/personalprofile/personalprofile.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { OrderProductComponent } from './components/order-product/order-product.component';
import { LoginComponent } from './components/login/login.component';
import { ProductdetailsComponent } from './components/productdetails/productdetails.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { OrderFinalizedComponent } from './components/order-finalized/order-finalized.component';
import { HeaderComponent } from './components/header/header.component';
import { NotAvailableComponent } from './components/not-available/not-available.component';
import { OrderedServicesComponent } from './components/ordered-services/ordered-services.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
  AvailabilityPickerComponent
} from './components/add-product/availability-picker/availability-picker.component';
import { HindrancePickerComponent } from './components/add-product/hindrance-picker/hindrance-picker.component';

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
    LoginComponent,
    ProductdetailsComponent,
    AddProductComponent,
    OrderHistoryComponent,
    OrderFinalizedComponent,
    HeaderComponent,
    NotAvailableComponent,
    OrderedServicesComponent,
    AvailabilityPickerComponent,
    HindrancePickerComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ],
  providers: [
    HttpClientModule
  ],
  bootstrap: [RootComponent]
})
export class AppModule {
}
