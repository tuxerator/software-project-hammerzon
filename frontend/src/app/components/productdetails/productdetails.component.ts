import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductdetailsService,ProductDetails} from 'src/app/services/productdetails.service';

@Component({
  templateUrl: './productdetails.component.html',
  styleUrls: ['./productdetails.component.css']
})
export class ProductdetailsComponent implements OnInit {
  //product: ProductDetails|undefined;
  //public productID: string;


  //constructor(private route:ActivatedRoute) {route.params.subscribe((params)=>{this.productID=params["id"]});}

  ngOnInit(): void {
    //Get the Product name from the current route.
    //const routeParams= this.route.snapshot.paramMap;
    //const productIDFromRoute= String(routeParams.get('productId'));
    //Find product that correspond with the name provided in route.
    //this.route= ProductInfo.find(product=>product._id===productIDFromRoute);
  }

}
