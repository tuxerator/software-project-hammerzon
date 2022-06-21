import { Component, OnInit } from '@angular/core';
import { Order, Status } from 'src/app/models/Order';
import { Availability, getAppointmentString, getDateString } from 'src/app/models/Product';
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
        for(let i = 0; i < this.orderList.length; i++)
        {
          this.orderList[i].timeOfOrder = new Date(this.orderList[i].timeOfOrder);
        }
        for(let i = 0; i < this.orderList.length; i++)
        {
          this.orderList[i].appointment.startDate = new Date(this.orderList[i].appointment.startDate);
          this.orderList[i].appointment.endDate = new Date(this.orderList[i].appointment.endDate);
        }
      },

      // error: There was an error.
      error: err => {
        console.error(err);
      }
    });
  }
  getDateString(date?:Availability):string
  {
    if(date)
    {
        return getAppointmentString(date);
    }
    return 'Fehler';
  }




  getTimeOrderString(date?: Date): string {
    if(date)
    {
        return getDateString(date);
    }
    return 'Fehler';
  }

}
