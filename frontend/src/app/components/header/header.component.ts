import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from 'src/app/models/Category';
import { AuthService } from 'src/app/services/auth.service';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public searchTerm:string = '';
  public categories?:Category[];

  constructor(public authService: AuthService, public router: Router,public categoryService:CategoryService) {
  }

  ngOnInit(): void {
    this.authService.getUser().subscribe({
      next: (user) => {
        /*if (!user) {
          this.router.navigate(['']);
        }*/
      },
      error: (err) => {
        console.error(err);
      }
    });
    this.categoryService.getCategoriesList().subscribe({
      next:(resp) => this.categories = resp.categories,
    })
  }

  public search(): void {
    this.router.navigate(['/'], { queryParams: { search: this.searchTerm } });
  }

  public logout(): void {
    console.log('Log out');
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => console.log(err)
    });
  }


}
