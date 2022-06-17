import { Component, Input, OnInit } from '@angular/core';
import { Product } from 'src/app/models/Product';

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

  public onClick()
  {
    if(this.click)
    {
      this.click(this.productInfo._id);
    }
  }

}
