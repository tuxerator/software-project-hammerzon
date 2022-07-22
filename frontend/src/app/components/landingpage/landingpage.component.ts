import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/Product';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { ListInfoReponse } from '../types';


@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.css']
})
export class LandingpageComponent implements OnInit {
  //
  public productListInfo: ListInfoReponse<Product> = {
    list: [],
    requestable: 0
  };
  public currentStart = 0;
  public currentLimit = 10;

  public loading = true;

  constructor(private productService: ProductService, private route: ActivatedRoute) {
  }


  ngOnInit(): void {
    console.log('LandingPage initialized!');
    // Gib die Query Params as der Rout und gebe sie weiter an das Backend

    this.route.queryParams.subscribe(params => {
        console.log(params);

        const search = this.parseToString(params['search']);
        const category = this.parseToString(params['category']);
        const start = this.parseToInt(params['start'], 0);
        const limit = this.parseToInt(params['limit'], 10);
        this.currentLimit = limit;

        console.log(`${ start } ${ limit } ${ search } ${category}`);
        this.requestList(start, limit, search,category);
      }
    );
  }

  parseToString(value:string,alternative:string=''):string
  {
    return  value ? value : alternative;
  }

  parseToInt(value: string, alternative: number): number {
    const new_val = parseInt(value);
    if (new_val) {
      return new_val;
    }
    return alternative;
  }

  // fragt nächsten Elemente die nach currentStart und currentLimit kommen
  // z.B currentStart= 0 currentLimit= 10 => currentStart= 10 currentLimit= 10
  //     Bei liste im Backend von z.B [0...99] würde das zu der liste im Frontend führen [10..29] mit requestable:70
  next(): void {
    this.currentStart += this.currentLimit;
    this.requestListWithSearch();
  }

  // fragt Elemente die vor currentStart und currentLimit kommen
  // z.B currentStart= 10 currentLimit= 10 => currentStart= 0 currentLimit= 10
  previous(): void {
    this.currentStart -= this.currentLimit;
    this.requestListWithSearch();
  }

  requestListWithSearch():void
  {
    const params = this.route.snapshot.params;
    const search = this.parseToString(params['search']);
    const category = this.parseToString(params['category']);
    //const start = this.parseToInt(params['start'], 0);
    //const limit = this.parseToInt(params['limit'], 10);

    //console.log(`${ start } ${ limit } ${ search } ${category}`);
    this.requestList(this.currentStart, this.currentLimit, search,category);
  }

  // Frägt nach Productliste bei dem Landingpageservice nach
  requestList(start: number = 0, limit: number = 10, search: string = '',category:string =''): void {
    this.loading = true;
    this.productService.getProductList(start, limit, search,category).subscribe({
      // next: Value arrived successfully!
      next: value => {
        console.log(value);
        this.productListInfo = value;
        /*this.productListInfo.list = this.productListInfo.list.map(x => {
          x.duration = new Date(x.duration);
          return x;
        })*/
        this.loading = false;
      },

      // error: There was an error.
      error: err => {
        console.error(err);
        this.loading = false;
      }
    });
  }

}
