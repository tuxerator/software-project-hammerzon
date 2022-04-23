import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { RootComponent } from './components/root/root.component';
import { AboutComponent } from './components/about/about.component';
import { LandingpageComponent } from './components/landingpage/landingpage.component';
import { HttpClientModule } from '@angular/common/http';
import { SampleComponent } from './components/sample/sample.component';
import { FormsModule } from '@angular/forms';
import { SophieunterfranzComponent } from './components/sophieunterfranz/sophieunterfranz.component';
import { LukaserneComponent } from './components/lukaserne/lukaserne.component';


@NgModule({
    declarations: [
        RootComponent,
        AboutComponent,
        LandingpageComponent,
        SampleComponent,
        SophieunterfranzComponent,
        LukaserneComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        FormsModule
    ],
    providers: [
        HttpClientModule
    ],
    bootstrap: [RootComponent]
})
export class AppModule { }
