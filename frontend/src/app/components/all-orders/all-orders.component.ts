import { Component, OnInit } from '@angular/core';
import { OrderInfo, OrderList, OrderService } from 'src/app/services/order.service';


@Component({
  templateUrl: './all-orders.component.html',
  styleUrls: ['./all-orders.component.css']
})
export class AllOrdersComponent implements OnInit {
  public orderList? : OrderList<OrderInfo>;
  constructor(private OrderService: OrderService) { }

  ngOnInit(): void {
    this.listAllOrders();
  }

  listAllOrders() : void {
    this.OrderService.listAllOrders().subscribe({
      // next: Value arrived successfully!
      next: value => {
          console.log('List of all Orders:');
          console.log(value);
          this.orderList = value;
      },

      // error: There was an error.
      error: err => {
          console.error(err);
      }
  });
  }
}
