import { Component, Input, OnInit } from '@angular/core';
import { Category } from 'src/app/models/Category';

@Component({
  selector: 'app-category-badge',
  templateUrl: './category-badge.component.html',
  styleUrls: ['./category-badge.component.css']
})
export class CategoryBadgeComponent implements OnInit {
  @Input()
  category?: Category;
  @Input()
  name?:string;
  @Input()
  color?:string;
  @Input()
  icon?:string;
  @Input()
  direction:'ver'|'hor'='ver';
  @Input()
  custom?:boolean;

  constructor() {

  }

  ngOnInit(): void {
    //if(!this.category && this.name && this.image && this.color)
    //{
    //  this.category = new Category(this.name,this.image,this.color);
    //}
  }

  getIconClass():(string|undefined)[]
  {
    if(this.custom||this.category?.custom)
    {
      return [];
    }
    if(this.category)
    {
      return (!this.isVer() ? ['bi',this.category.icon,'me-1']:['bi',this.category?.icon]);
    }
    return (!this.isVer() ? ['bi',this.icon,'me-1']:['bi',this.icon]);
  }

  isCustom():boolean
  {
    return !!(this.custom || this.category?.custom);
  }

  getIconStyle():{background?:string,width?:string,height?:string}{
    let url:string|undefined = undefined;
    if(this.category  && this.category.custom)
    {
      url = this.category.icon;
    }else if(this.custom){
      url = this.icon;
    }
    console.log(url);
    if(url)
    {
      return {
        background:`url("${url}")`,
        width:'20px',
        height:'20px'
      };
    }

    return {};
  }



  isVer():boolean{
    return this.direction ==='ver';
  }

}
