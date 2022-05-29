import { Component, Input, OnInit } from '@angular/core';
import { AboutMeService, NameInfo } from '../../services/about-me.service';

@Component({
  selector: 'app-about-me',
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.css']
})
export class AboutMeComponent implements OnInit {

  @Input()
  public nameID = '';

  public myName?: NameInfo;

  constructor(private aboutMeService: AboutMeService) {
  }

  ngOnInit(): void {
    this.aboutMeService.getNameInfo(this.nameID).subscribe({
      // next: Value arrived successfully!
      next: value => {
        this.myName = value;
      },

      // error: There was an error.
      error: err => {
        console.error(err);
        this.myName = {
          firstName: 'Max',
          lastName: 'Mustermann',
          optionalAttribut: 'Dies ist ein Platzhalter!'
        };
      }
    });
  }

}
