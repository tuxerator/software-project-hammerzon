import { Component, OnInit } from '@angular/core';
import { Order, Status } from 'src/app/models/Order';
import { Availability, getAppointmentString } from 'src/app/models/Product';
import { OrderService } from 'src/app/services/order.service';

@Component({
  templateUrl: './ordered-services.component.html',
  styleUrls: ['./ordered-services.component.css']
})
export class OrderedServicesComponent implements OnInit {
  public orderList : Order[] = [];
  public status = Status;

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.listOrdersByProductCreator();
  }

  listOrdersByProductCreator() : void {
    this.orderService.listOrdersByProductCreator().subscribe({
      next: value => {
        console.log(value);
        this.orderList = value;
        for(let i = 0; i < this.orderList.length; i++)
        {
          this.orderList[i].appointment.startDate = new Date(this.orderList[i].appointment.startDate);
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
  getDateString(app?:Availability):string
  {
    if(app)
    {
    return getAppointmentString(app);
    }
    return 'Fehler';
  }

  setLocalOrderStatus(index:number, status:Status) : void
  {
    this.orderList[index].status = status;
  }

}
