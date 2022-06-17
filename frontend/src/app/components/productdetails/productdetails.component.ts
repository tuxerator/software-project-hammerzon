import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../models/User';
import { AuthService } from '../../services/auth.service';

import { Product, getAppointmentString, getDurationString } from '../../models/Product';
import { ProductService } from '../../services/product.service';
import { createHistogram } from 'perf_hooks';




@Component({
  templateUrl: './productdetails.component.html',
  styleUrls: ['./productdetails.component.css']
})
export class ProductdetailsComponent implements OnInit {
  product: Product | undefined;
  //public productID: string;
  user: User | undefined;

  id:string = '';

  similarProducts?:Product[];
  // Zum formatieren der Daten


  constructor(private route:ActivatedRoute,
              private productService:ProductService,
              private router:Router,
              public authService: AuthService) {
    console.log('kommt zu Params');
  }

  ngOnInit(): void {
    //Get the Product name from the current route.
    console.log('kommt zu Params');
    const routeParams = this.route.snapshot.paramMap;
    this.id = String(routeParams.get('id'));
    this.changeId(this.id);

    this.user = this.authService.user;
    // is there a user logged in? get the user.
    /*this.authService.getUser().subscribe(
      {
        next: (val) => {
          this.user = val;
        },
        error: (err) => {
          console.log(err);
        }
      }
    );*/
  }

  public changeId(id:string):void
  {
    this.id = id;

    console.log(this.id);
    console.log(this.productService);
    //Find product that correspond with the name provided in route.
    //this.route= ProductInfo.find(product=>product._id===productIDFromRoute);
    this.productService.getProductDetails(this.id).subscribe(
      {
        next: (val) => {
          this.product = val;
          this.product.duration = new Date(this.product.duration);
          for (let i = 0; i < this.product.appointments.length; i++) {
            this.product.appointments[i].date = new Date(this.product.appointments[i].date);
          }

          console.log(this.product);
          console.log(this.user);
        },
        error: (err) => {
          console.log(err);
          // Wenn etwas schief läuft einfach wieder zu landing page
          this.router.navigate(['/']);
        }
      }
    );

    this.productService.getSimilarProducts(this.id).subscribe(
      {
        next: (res) => this.similarProducts = res.list,
      }
    );
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });

  }

  getDurString(): string {
    return getDurationString(this.product?.duration);
  }

  getAppointString(date?: Date): string {
    return getAppointmentString(date);
  }

  deleteProduct()
  {
    this.productService.removeProduct(this.id).subscribe({
      next:() => {
        this.router.navigate(['/']);
      },
      error:(err) =>
      {
        console.log(err.error);
      }
      }
    );

  }

}
