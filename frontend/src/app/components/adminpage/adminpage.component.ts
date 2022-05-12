import { Component, OnInit } from '@angular/core';
import { OrderInfo, OrderList, OrderService } from 'src/app/services/order.service';

@Component({
  templateUrl: './adminpage.component.html',
  styleUrls: ['./adminpage.component.css']
})
/**
 * page for testing the order frontend
 */
export class AdminpageComponent implements OnInit {

  public orderList : OrderList<OrderInfo> = {
                                            list:[]
  };
  /*
  public orderInfo : OrderInfo = {
                                    product: '',
                                    orderingUser: '',
                                    timeOfOrder: ''
                                 };
  */
  constructor(private OrderService: OrderService) { }

  ngOnInit(): void {
    this.listAllOrders();
  }
  listAllOrders(): void
  {
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
