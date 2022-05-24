import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Order } from 'src/app/models/Order';
import { getAppointmentString } from 'src/app/models/Product';
import {  OrderService } from 'src/app/services/order.service';


@Component({
  templateUrl: './all-orders.component.html',
  styleUrls: ['./all-orders.component.css'],
})
export class AllOrdersComponent implements OnInit {
  public orderList : Order[] = [];

  constructor(private OrderService: OrderService,
              private changeDetector: ChangeDetectorRef
    ) { }

  

  ngOnInit(): void {
    this.listAllOrders();
  }

  listAllOrders() : void
  {
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

  toggleConfirm(index:number): void
  {
    if(this.orderList)
    {
      this.OrderService.toggleConfirm(this.orderList[index]).subscribe({
        next: value => {
          console.log(value);
          if(this.orderList)
          {
            this.setOrderStatus(index, value);
            this.changeDetector.detectChanges();
          }
        },
        error: err => {
            console.error(err);
        }
    });
    }
    this.changeDetector.detectChanges();
  }
  getDateString(date?:Date):string
  {
    return getAppointmentString(date);
  }

  setOrderStatus(index:number, status:boolean) : void
  {
    this.orderList[index].confirmed = status;
  }
}