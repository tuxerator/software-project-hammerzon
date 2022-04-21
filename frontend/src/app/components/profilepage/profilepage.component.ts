import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NameInfo } from 'src/app/services/about.service';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  templateUrl: './profilepage.component.html',
  styleUrls: ['./profilepage.component.css']
})
export class ProfilepageComponent implements OnInit {

  public profile?:NameInfo;


  constructor(public route:ActivatedRoute,private profileService:ProfileService) {

  }

  ngOnInit(): void {

    this.route.params.subscribe((params) => {
      this.onParamRecive(params['name']);
    });
  }

  onParamRecive(profileName:string):void
  {
    this.profileService.getProfileInfo(profileName).subscribe({
      // next: Unser Wert kam erfolgreich an!
      next: (val) => {
        this.profile = val;
      },

      // error: Es gab einen Fehler
      error: (err) => {
        console.error(err);
        this.profile = {
          firstName: 'Error!',
          lastName: 'Error!'
        };
      }
    });
  }

}
