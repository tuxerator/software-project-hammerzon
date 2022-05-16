import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    templateUrl: './root.component.html',
    styleUrls: ['./root.component.css'],
    selector: 'app-root'
})
export class RootComponent implements OnInit{

    constructor(public authService:AuthService,private router:Router ) {
    }

    ngOnInit(): void {
      this.authService.getUser().subscribe({
        next: (user) => {
          if (user) {
            //this.router.navigate(['']);
          }
        },
        error: (err) => {
          console.error(err);
          //this.router.navigate(['']);
        }
      });
    }

    logout():void
    {
      console.log('Log out');
      this.authService.logout().subscribe({
        next: () =>
        {
          this.router.navigate(['/']);
        },
        error:(err) => console.log(err)
      });
    }

}
