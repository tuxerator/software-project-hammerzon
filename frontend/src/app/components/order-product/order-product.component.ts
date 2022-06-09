import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from 'src/app/services/order.service';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { Appointment, getAppointmentString, getDurationString, Product } from 'src/app/models/Product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  templateUrl: './order-product.component.html',
  styleUrls: ['./order-product.component.css']
})
export class OrderProductComponent implements OnInit {
  product : Product|undefined;
  user: User|undefined;
  appointment:Appointment|undefined;
  appointmentIndex = 0; 
  orderRegistered : Boolean|undefined;
  cancelled : Boolean = false;
  constructor(private route:ActivatedRoute,
              private productService:ProductService,
              private authService: AuthService,
              private orderService: OrderService,
              private router: Router) {
  }

  paySWP: Boolean = false;
  payBC: Boolean = false;
  payHCI: Boolean = false;
  bestätigt: Boolean = false;

  switchBest(): void{
    this.bestätigt = true;
  }

  switchSWP() : void {
    this.paySWP = true;
    this.payBC = false;
    this.payHCI = false;
  }

  switchHCI(): void {
    this.payHCI = true;
    this.paySWP = false;
    this.payBC = false;
  }

  switchBC(): void {
    this.payBC = true;
    this.payHCI = false;
    this.paySWP = false;
  }

  ngOnInit(): void {
    // get the productinfo again
    const routeParams = this.route.snapshot.paramMap;
    const productIDFromRoute = String(routeParams.get('id'));
    const appointmentIndex = parseInt(String(routeParams.get('i')));
    this.appointmentIndex = appointmentIndex;
    /**
     * get information about the product , register the order (make functions?)
     */
    this.productService.getProductDetails(productIDFromRoute).subscribe(
      {
        next: (val) => {
          this.product = val;
          this.product.duration = new Date(this.product.duration);
          this.appointment = this.product.appointments[appointmentIndex];
          this.appointment.date = new Date(this.appointment.date);
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
    if (this.product) {
      this.orderService.registerOrder(this.product._id, this.appointmentIndex).subscribe(
        {
          next: (val) => {
            this.orderRegistered = val;
            console.log('orderRegistered:' + this.orderRegistered);
            if (this.orderRegistered === true) {
              const url = `productdetails/${ this.product?._id }/order-product/${ this.appointmentIndex }/order-finalized`;
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
    return getAppointmentString(this.appointment?.date);
  }


}
