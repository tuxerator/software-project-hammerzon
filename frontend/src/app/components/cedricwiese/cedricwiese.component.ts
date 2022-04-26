import { Component, OnInit } from '@angular/core';
import { CedricwieseService, CedricInfo } from 'src/app/services/cedricwiese.service';
/*import { SampleService } from 'src/app/services/sample.service';*/

@Component({
  templateUrl: './cedricwiese.component.html',
  styleUrls: ['./cedricwiese.component.css']
})
export class CedricwieseComponent implements OnInit {
  
  public cedricInfo?: CedricInfo;
  
  constructor(
    private cedricwieseService: CedricwieseService) {
      
  }

  ngOnInit(): void {
    
    this.cedricwieseService.getCedricInfo().subscribe({
      
      next: (val) => {
        this.cedricInfo = val;
      },

    
      error: (err) => {
        console.error(err);
        this.cedricInfo = {
          firstName: 'Error!',
          lastName: 'Error!'
        };
      }
    });
  }
}
