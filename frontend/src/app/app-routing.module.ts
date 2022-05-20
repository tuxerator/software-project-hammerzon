import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { LandingpageComponent } from './components/landingpage/landingpage.component';
import { AboutMeComponent } from './components/about-me/about-me.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { AllOrdersComponent } from './components/all-orders/all-orders.component';
import { OrderProductComponent } from './components/order-product/order-product.component';
import { LoginComponent } from './components/login/login.component';
import { PersonalProfileComponent } from './components/personalprofile/personalprofile.component';
import { ProductdetailsComponent } from './components/productdetails/productdetails.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { OrderFinalizedComponent } from './components/order-finalized/order-finalized.component';

import { AuthGuardService } from './services/auth-guard.service';
import { AdminAuthGuardService } from './services/admin-auth-guard.service';


/**
 *  Hier können die verschiedenen Routen definiert werden.
 *  Jeder Eintrag ist eine URL, die von Angular selbst kontrolliert wird.
 *  Dazu wird die angebene Komponente in das "<router-outlet>" der "root" Komponente geladen.
 *
 *  Siehe z.B. https://angular.io/guide/router
 */
const routes: Routes = [
    { path: '', component: LandingpageComponent },
    { path: 'about', component: AboutComponent },
    { path: 'about/:name',component: AboutMeComponent},
    // Auth
    { path: 'register',component: RegistrationComponent},
    { path: 'login',component: LoginComponent},
    { path: 'personalprofile', component: PersonalProfileComponent,canActivate: [AuthGuardService]},
    // Order
    { path: 'all-orders', component: AllOrdersComponent, canActivate: [AdminAuthGuardService]},
    { path: 'order-history', component: OrderHistoryComponent},
    // product
    { path: 'productdetails/:id/order-product/:i', component: OrderProductComponent,},  // should be: product/order-product
    { path: 'productdetails/:id',component:ProductdetailsComponent},
    { path: 'add-product', component: AddProductComponent, canActivate:[AuthGuardService]},
    { path: 'productdetails/:id/order-product/:i/order-finalized', component: OrderFinalizedComponent,canActivate: [AuthGuardService]}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [
      AuthGuardService,
      AdminAuthGuardService
    ]
})
export class AppRoutingModule { }
