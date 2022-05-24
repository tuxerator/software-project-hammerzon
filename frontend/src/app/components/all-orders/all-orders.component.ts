import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/models/Order';
import { getAppointmentString } from 'src/app/models/Product';
import { OrderService } from 'src/app/services/order.service';

@Component({
  templateUrl: './all-orders.component.html',
  styleUrls: ['./all-orders.component.css']
})
export class AllOrdersComponent implements OnInit {
  public orderList?: Order[];

  constructor(private OrderService: OrderService
  ) {
  }

  ngOnInit(): void {
    this.listAllOrders();
  }

  listAllOrders(): void {
    this.OrderService.listAllOrders().subscribe({
      next: value => {
        console.log(value);
        this.orderList = value;
      },
      error: err => {
        console.error(err);
      }
    });
  }

  getDateString(date?: Date): string {
    return getAppointmentString(date);
  }
}
