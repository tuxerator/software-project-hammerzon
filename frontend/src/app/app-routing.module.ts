import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { LandingpageComponent } from './components/landingpage/landingpage.component';
import { AboutMeComponent } from './components/about-me/about-me.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { AllOrdersComponent } from './components/all-orders/all-orders.component';



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
    { path: 'register',component: RegistrationComponent},
    { path: 'all-orders', component: AllOrdersComponent}

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
