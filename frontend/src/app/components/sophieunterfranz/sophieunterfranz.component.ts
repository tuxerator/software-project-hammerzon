import { Component, OnInit } from '@angular/core';
import { SophieName, SophieunterfranzService } from 'src/app/services/sophieunterfranz.service';

@Component({
  templateUrl: './sophieunterfranz.component.html',
  styleUrls: ['./sophieunterfranz.component.css']
})
export class SophieunterfranzComponent implements OnInit {
   public sophieName?: SophieName;

  constructor(private sophieUnterfranzService: SophieunterfranzService) { }

  ngOnInit(): void {
    this.sophieUnterfranzService.getSophieName().subscribe({
      next: (value: SophieName) =>{
        this.sophieName= value;
      },
      error:(err) => {
        console.error(err);
        this.sophieName = {
          firstName: 'Error',
          lastName: 'Error'
        };
      }

    });
  }

}
