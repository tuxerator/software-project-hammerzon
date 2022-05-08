import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductdetailsService,ProductDetails} from 'src/app/services/productdetails.service';

@Component({
  templateUrl: './productdetails.component.html',
  styleUrls: ['./productdetails.component.css']
})
export class ProductdetailsComponent implements OnInit {
  product: ProductDetails|undefined;
  //public productID: string;


  constructor(private route:ActivatedRoute,private productService:ProductdetailsService) {
    console.log('kommt zu Params');
  }

  ngOnInit(): void {
    //Get the Product name from the current route.
    console.log('kommt zu Params');
    const routeParams= this.route.snapshot.paramMap;
    const productIDFromRoute= String(routeParams.get('id'));

    console.log(productIDFromRoute);
    console.log(this.productService);
    //Find product that correspond with the name provided in route.
    //this.route= ProductInfo.find(product=>product._id===productIDFromRoute);
    this.productService.getProductDetails(productIDFromRoute).subscribe(
      {
        next: (val)=>{
          this.product = val;
        },
        error: (err)=> {
          console.log(err);
        }
      }
    );
  }

}
