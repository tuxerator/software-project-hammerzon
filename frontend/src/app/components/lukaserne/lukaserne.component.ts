import { Component, OnInit } from '@angular/core';
import { LukasErneService, LukasName } from 'src/app/services/lukas-erne.service';

@Component({
  templateUrl: './lukaserne.component.html',
  styleUrls: ['./lukaserne.component.css']
})
/**
 * Nutzt den LukasErneService, um den Namen vom API Endpoint zu fetchen,
 * analog zum im AboutComponent verwendeten Prinzip
 */
export class LukaserneComponent implements OnInit {
  public lukasName?: LukasName;

  constructor(private lukasErneService: LukasErneService) { }

  ngOnInit(): void {
    this.lukasErneService.getLukasName().subscribe({
      next:(val) => {
        this.lukasName = val;
      },
      error: (err) => {
        console.error(err);
        this.lukasName = {
          name: 'Error'
        };
      }
    });
  }

}
