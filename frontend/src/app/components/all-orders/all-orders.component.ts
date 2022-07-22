import { Component,  OnInit } from '@angular/core';
import { Order, Status } from 'src/app/models/Order';
import { getDateString } from 'src/app/models/Product';
import { OrderService } from 'src/app/services/order.service';


@Component({
  selector:'app-all-orders',
  templateUrl: './all-orders.component.html',
  styleUrls: ['./all-orders.component.css'],
})
export class AllOrdersComponent implements OnInit {
  public orderList : Order[] = [];
  public status = Status;

  constructor(private orderService: OrderService) { }


  ngOnInit(): void {
    this.listAllOrders();
  }

  listAllOrders(): void {
    this.orderService.listAllOrders().subscribe({
      next: value => {
        console.log(value);
        this.orderList = value;
        for (let i = 0; i < this.orderList.length; i++)
        {
          this.orderList[i].timeOfOrder = new Date(this.orderList[i].timeOfOrder);
        }
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
      this.orderService.setStatus(this.orderList[index]._id, status).subscribe({
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
    if(date)
    {
    return getDateString(date);
    }
    return 'Fehler';
  }

  setLocalOrderStatus(index:number, status:Status) : void
  {
    this.orderList[index].status = status;
  }
}
