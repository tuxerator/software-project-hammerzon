import { Component, OnInit } from '@angular/core';
import { Order, Status } from 'src/app/models/Order';
import { getAppointmentString } from 'src/app/models/Product';
import { OrderService } from 'src/app/services/order.service';


@Component({
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {
  orderList? : Order[];
  public status = Status;

  constructor(private OrderService: OrderService
  ) {
  }

  ngOnInit(): void {
    this.listAllOrdersByUser();
  }

  listAllOrdersByUser(): void {
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


  getTimeOrderString(date?: Date): string {
    return getAppointmentString(date);
  }

}
