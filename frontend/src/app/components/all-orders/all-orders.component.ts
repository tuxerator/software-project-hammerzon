import { Component,  OnInit } from '@angular/core';
import { Order, Status } from 'src/app/models/Order';
import { getAppointmentString } from 'src/app/models/Product';
import { OrderService } from 'src/app/services/order.service';


@Component({
  templateUrl: './all-orders.component.html',
  styleUrls: ['./all-orders.component.css'],
})
export class AllOrdersComponent implements OnInit {
  public orderList : Order[] = [];
  public status = Status;
  
  constructor(private OrderService: OrderService,
    ) { }
  

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

  setStatus(index:number, status:Status): void
  { 
    console.log('status set:' + status);
    if(this.orderList)
    {
      this.OrderService.setStatus(this.orderList[index]._id, status).subscribe({
        next: value => {
          const st = JSON.parse(JSON.stringify(value));
          console.log(st.status);
          if(this.orderList)
          {
            this.setLocalOrderStatus(index, st.status);
          }
        },
        error: err => {
            console.error(err);
        }
    });
    }
  }
  getDateString(date?:Date):string
  {
    return getAppointmentString(date);
  }

  setLocalOrderStatus(index:number, status:Status) : void
  {
    this.orderList[index].status = status;
  }
}
