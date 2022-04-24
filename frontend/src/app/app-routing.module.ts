import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { HenriAboutpageComponent } from './components/henriAboutpage/henriAboutpage.component';
import { LandingpageComponent } from './components/landingpage/landingpage.component';
import { SophieunterfranzComponent } from './components/sophieunterfranz/sophieunterfranz.component';
import { LukaserneComponent } from './components/lukaserne/lukaserne.component';


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
    { path: 'sophieunterfranz', component: SophieunterfranzComponent},
    { path: 'lukaserne' , component: LukaserneComponent },
    { path: 'about/:name',component: HenriAboutpageComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
