import { Component } from "@angular/core";

@Component({
    selector: 'personalprofile',
    templateUrl: './personalprofile.component.html'
})
export class PersonalProfileComponent {
    vorname?: String;
    nachname?: String;
    email?: String;
    strasse?: String;
    hausnummer?: Number;
    land?: String;
    editMode: boolean = false;

    activeEditMode(){
        this.editMode = !(this.editMode);
    }

    
}


