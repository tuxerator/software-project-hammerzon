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

  constructor() {

  }

  ngOnInit(): void {
    //if(!this.category && this.name && this.image && this.color)
    //{
    //  this.category = new Category(this.name,this.image,this.color);
    //}
  }

}
