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
  public current_category:string = '';


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
    });
  }

  public search(): void {
    const queryParams:any = {search:this.searchTerm};
    if(this.current_category !== '')
    {
      queryParams.category = this.current_category;
    }

    this.router.navigate(['/'], { queryParams});
  }

  public selectCategory(category:string):void{

    const queryParams:any = {category};
    if(this.searchTerm !== '')
    {
      queryParams.search = this.searchTerm;
    }

    if(this.current_category === category)
    {
      this.current_category = '';

      this.router.navigate(['/']);
    }
    else{
      this.current_category = category;

      this.router.navigate(['/'], { queryParams});
    }
  }

  public logout(): void {
    console.log('Log out');
    this.authService.logout().subscribe({
      next: () => {
        //this.router.navigate(['/']);
      },
      error: (err) => console.log(err)
    });
  }

  public isOnLandingPage():boolean
  {
    console.log(this.router.url);
    let url = this.router.url;
    const queryStart = url.indexOf('?');

    if(queryStart >= 0)
    {
      url =  this.router.url.substring(0,queryStart);
    }

    return url === '/';
  }


}
