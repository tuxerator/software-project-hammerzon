import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { LandingpageComponent } from './components/landingpage/landingpage.component';
import { AboutMeComponent } from './components/about-me/about-me.component';
import { LoginComponent } from './components/login/login.component';
import { AdminpageComponent } from './components/adminpage/adminpage.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { PersonalProfileComponent } from './components/personalprofile/personalprofile.component';


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
    { path: 'login',component: LoginComponent},
    { path: 'adminpage', component: AdminpageComponent},
    { path: 'register',component: RegistrationComponent},
    { path: 'personalprofile', component: PersonalProfileComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
