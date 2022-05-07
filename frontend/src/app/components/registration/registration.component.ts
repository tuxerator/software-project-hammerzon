import { Component } from "@angular/core";
import {User} from '../../services/auth.service';

@Component({
    selector: "app-registration",
    templateUrl: "./registration.component.html"
})
export class RegistrationComponent{
    public user:User = {name:'',email:'',password:'',address:{street:'',houseNum:'',postCode:'',city:'',country:''}};
    constructor(){}

    public register()
    {

    }
}
