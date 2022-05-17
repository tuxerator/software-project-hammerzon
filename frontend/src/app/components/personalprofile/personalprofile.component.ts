import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/User';
import { AuthService } from '../../services/auth.service';

@Component({

    selector: 'app-personalprofile',
    templateUrl: './personalprofile.component.html'
})
export class PersonalProfileComponent implements OnInit{
    vorname?: String;
    nachname?: String;
    email?: String;
    strasse?: String;
    hausnummer?: Number;
    stadt?: String;
    postleitzahl?: Number;
    land?: String;
    editMode: boolean = false;

    user?:User;

    constructor(private authService:AuthService)
    {

    }

    ngOnInit(): void {
      this.authService.getUser().subscribe({
        next: (user) => {
          if (user) {
            this.user= user;
          }
        },
        error: (err) => {
          console.error(err);
        }
      });
    }

    activeEditMode(){
        this.editMode = !(this.editMode);
    }
}


