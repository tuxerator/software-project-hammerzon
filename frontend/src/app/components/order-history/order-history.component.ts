import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/models/Order';
import { getAppointmentString } from 'src/app/models/Product';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/order.service';
import { ProductdetailsService } from 'src/app/services/productdetails.service';

@Component({
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {
  orderList? : Order[];


  constructor(private OrderService: OrderService,
              private productService: ProductdetailsService,
              private authService : AuthService
    ) { }

    ngOnInit(): void {
      this.listAllOrdersByUser();
    }

    listAllOrdersByUser() : void{
      this.OrderService.listAllOrdersByUser().subscribe({
        // next: Value arrived successfully!
        next: value => {
            console.log('List of all Orders from this user:');
            this.orderList = value;
            console.log(this.orderList);
        },

        // error: There was an error.
        error: err => {
            console.error(err);
        }
      });
    }


    getTimeOrderString(date?:Date):string{
      return getAppointmentString(date);
    }

}
