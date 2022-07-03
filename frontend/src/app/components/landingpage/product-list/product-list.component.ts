import { Component, Input, OnInit } from '@angular/core';
import { Product } from 'src/app/models/Product';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  @Input()
  list?:Product[];
  @Input()
  click?: (id:string) => void;

  constructor() { }

  ngOnInit(): void {
  }

}
