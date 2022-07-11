import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from 'src/app/services/order.service';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { Availability, getAppointmentString, getDurationString, Product } from 'src/app/models/Product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  templateUrl: './order-product.component.html',
  styleUrls: ['./order-product.component.css']
})
export class OrderProductComponent implements OnInit {
  product: Product | undefined;
  user: User | undefined;
  appointment: Availability | undefined;
  orderRegistered: Boolean | undefined;
  cancelled: Boolean = false;
  startDate?:Date;


  constructor(private route: ActivatedRoute,
              private productService: ProductService,
              private authService: AuthService,
              private orderService: OrderService,
              private router: Router) {
  }

  ngOnInit(): void {
    // get the productinfo again
    const routeParams = this.route.snapshot.paramMap;
    const productIDFromRoute = String(routeParams.get('id'));
    this.appointment = this.orderService.currentlySelectedAppointment;


    /**
     * get information about the product , register the order (make functions?)
     */
    this.productService.getProductDetails(productIDFromRoute).subscribe(
      {
        next: (val) => {
          this.product = val;
          this.product.duration = new Date(this.product.duration);

        },
        error: (err) => {
          console.log(err);
        }
      }
    );
    // get the userinfo
    this.authService.getUser().subscribe(
      {
        next: (val) => {
          this.user = val;
        },
        error: (err) => {
          console.log(err);
        }
      }
    );
  }

  register(): void {
    console.log(this.appointment);
    if (this.product && this.appointment) {
     this.orderService.addOrder(this.product._id, this.appointment).subscribe(
        {
          next: (val) => {
            this.orderRegistered = val.orderRegistered;
            console.log('orderRegistered:' + this.orderRegistered);
            if (this.orderRegistered) {
              const url = `productdetails/${ this.product?._id }/order-product/${ this.appointment?.startDate }/order-finalized`;
              console.log('navigating to: ' + url);
              this.router.navigateByUrl(url);
            } else {
              // appointment not available
              this.router.navigateByUrl('not-available');
            }
          },
          error: (err) => {
            console.error(err);
          }
        }
      );
    }
  }


  getDurString(): string {
    return getDurationString(this.product?.duration);
  }

  getAppointString(): string {
    if(this.appointment)
    {
    return getAppointmentString(this.appointment);
    }return 'Fehler';
  }


}
