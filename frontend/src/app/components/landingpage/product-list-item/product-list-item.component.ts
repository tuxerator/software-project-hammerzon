import { Component, Input, OnInit } from '@angular/core';
import { Category } from 'src/app/models/Category';
import { getCategory, getDurationString, Product } from 'src/app/models/Product';

@Component({
  selector: 'app-product-list-item',
  templateUrl: './product-list-item.component.html',
  styleUrls: ['./product-list-item.component.css']
})
export class ProductListItemComponent implements OnInit {

  @Input()
  productInfo!:Product;

  @Input()
  click?: (id:string) => void;

  constructor() { }

  ngOnInit(): void {

  }

  public getCategory():undefined|Category
  {
    return this.productInfo ? getCategory(this.productInfo) : undefined;
  }

  public getDuration():string
  {
    this.productInfo.duration = new Date(this.productInfo.duration);
    return this.productInfo ? getDurationString(this.productInfo.duration) : '';
  }

  public onClick()
  {
    if(this.click)
    {
      this.click(this.productInfo._id);
    }
  }

}
