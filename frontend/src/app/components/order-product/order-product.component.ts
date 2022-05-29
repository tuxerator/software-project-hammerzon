import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductdetailsService, Appointment} from 'src/app/services/productdetails.service';
import { OrderInfo, OrderService } from 'src/app/services/order.service';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { NavigationStart, Router } from '@angular/router';
import { getAppointmentString, getDurationString, Product } from 'src/app/models/Product';

@Component({
  templateUrl: './order-product.component.html',
  styleUrls: ['./order-product.component.css']
})
export class OrderProductComponent implements OnInit , OnDestroy{
  product : Product|undefined;
  user: User|undefined;
  appointment:Appointment|undefined;
  appointmentIndex:Number|undefined;
  order : OrderInfo|undefined;
  cancelled : Boolean = false;
  constructor(private route:ActivatedRoute,
              private productService:ProductdetailsService,
              private authService: AuthService,
              private orderService: OrderService,
              private router: Router) { }

  ngOnInit(): void {
    this.detectRouterEvent();
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
        next: (val)=>{
          this.product = val;
          this.product.duration = new Date(this.product.duration);
          this.appointment = this.product.appointments[appointmentIndex];
          this.appointment.date = new Date(this.appointment.date);
          console.log('registering order');
          this.orderService.registerOrder(this.product._id , appointmentIndex).subscribe(
            {
              next: (val) => {
                this.order = val;
                console.log(this.order);
              },
              error: (err) => {
                console.error(err);
              }
              }
          );
        },
        error: (err)=> {
          console.log(err);
        }
      }
    );
    // get the userinfo
    this.authService.getUser().subscribe(
      {
        next: (val)=>{
          this.user = val;
        },
        error: (err)=> {
          console.log(err);
        }
      }
    );
  }
  ngOnDestroy() : void
  {
    console.log('left the component');
    this.cancel();
  }

  /**
   * cancel the order by leaving the page
   * while the order is not finalized.
   */
  cancel() : void
  {
    if(this.order?.finalized === false && this.cancelled === false)
    {
      // delete order and set product appointment to not reserved
      console.log('order cancelled');
      if(this.order)
      {
        console.log('deleting order');
        console.log(this.order._id);
        this.orderService.deleteOrder(this.order._id).subscribe();
      }
      console.log(this.product);
      console.log(this.appointmentIndex);
      if(this.product && this.appointmentIndex)
      {
        console.log('resetting appointment');
        this.orderService.resetProduct(this.product._id, this.appointmentIndex).subscribe();
      }
      this.cancelled = true;
    }
    else
    {
      console.log('order finalized or already cancelled.');
    }


  }

  finalize() : void
  {
    if(this.order?.finalized === false)
    {
      this.orderService.finalizeOrder(this.order._id).subscribe(
        {
          next: (val) => {
            this.order = val;
            console.log(this.order);
            const url = `productdetails/${this.product?._id}/order-product/${this.appointmentIndex}/order-finalized`;
            this.router.navigateByUrl(url);
          },
          error: (err) => {
            console.error(err);
          }
        }
      );
      // has to navigate here so the order isn't deleted
      // const url = `productdetails/${this.product?._id}/order-product/${this.appointmentIndex}/order-finalized`;
      // this.router.navigateByUrl(url);
    }
    else
    {
      console.log('order already finalized');
    }
  }

  detectRouterEvent() : void
  {
    this.router.events.forEach((event) =>{
      if(event instanceof NavigationStart){
        if (event.navigationTrigger === 'popstate'){
          console.log('pressed back button');
          this.cancel();
        }
      }
   });
  }

  getDurString():string
  {
    return getDurationString(this.product?.duration);
  }

  getAppointString():string
  {
    return getAppointmentString(this.appointment?.date);
  }


}
