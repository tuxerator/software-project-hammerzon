import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductdetailsService,ProductDetails, Appointment} from 'src/app/services/productdetails.service';
import { OrderService } from 'src/app/services/order.service';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  templateUrl: './order-product.component.html',
  styleUrls: ['./order-product.component.css']
})
export class OrderProductComponent implements OnInit {
  product : ProductDetails|undefined;
  user: User|undefined;
  appointment:Appointment|undefined;
  constructor(private route:ActivatedRoute,
              private productService:ProductdetailsService,
              private authService: AuthService,
              private orderService: OrderService) { }

  ngOnInit(): void {
    // get the productinfo again
    const routeParams = this.route.snapshot.paramMap;
    const productIDFromRoute = String(routeParams.get('id'));
    const appointmentIndex = parseInt(String(routeParams.get('i')));
    

    this.productService.getProductDetails(productIDFromRoute).subscribe(
      {
        next: (val)=>{
          this.product = val;
          this.appointment = this.product.appointments[appointmentIndex];
          console.log('registering order');
          this.orderService.registerOrder(this.product._id , appointmentIndex);
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
  cancel() : void
  {
    // delete order and set product appointment to not reserved
    
  }

}
