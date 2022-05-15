import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductdetailsService,ProductDetails, Appointment} from 'src/app/services/productdetails.service';
import { OrderInfo, OrderService } from 'src/app/services/order.service';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  templateUrl: './order-product.component.html',
  styleUrls: ['./order-product.component.css']
})
export class OrderProductComponent implements OnInit , OnDestroy{
  product : ProductDetails|undefined;
  user: User|undefined;
  appointment:Appointment|undefined;
  appointmentIndex:Number|undefined;
  order : OrderInfo|undefined;
  constructor(private route:ActivatedRoute,
              private productService:ProductdetailsService,
              private authService: AuthService,
              private orderService: OrderService) { }

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
        next: (val)=>{
          this.product = val;
          this.appointment = this.product.appointments[appointmentIndex];
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
    if(this.order?.finalized === false)
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
          },
          error: (err) => {
            console.error(err);
          }
        }
      );
    }
    else
    {
      console.log('order already finalized');
    }
  }

  

}
