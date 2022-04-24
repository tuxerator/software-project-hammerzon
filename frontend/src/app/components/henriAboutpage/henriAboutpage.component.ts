import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NameInfo } from 'src/app/services/about.service';
import { HenriAboutService } from 'src/app/services/henriAbout.service';

@Component({
  templateUrl: './henriAboutpage.component.html',
  styleUrls: ['./henriAboutpage.component.css']
})
export class HenriAboutpageComponent implements OnInit {

  public nameInfo?:NameInfo;


  constructor(public route:ActivatedRoute,private profileService:HenriAboutService) {

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
        this.nameInfo = val;
      },

      // error: Es gab einen Fehler
      error: (err) => {
        console.error(err);
        this.nameInfo = {
          firstName: 'Error!',
          lastName: 'Error!'
        };
      }
    });
  }

}
