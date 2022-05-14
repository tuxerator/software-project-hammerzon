import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment, ProductDetails } from './productdetails.service';
import { ProductInfo } from './landingpage.service';


export type OrderList<T>={
  list: T[]
}

export type OrderInfo={
  _id : string,
  product : string,
  orderingUser: string,
  timeOfOrder: Date,
  finalized: boolean,
  appointment : Appointment
}
export type PostOrder={
  productId : string,
  appointmentIndex : Number
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  public currentOrder :OrderInfo|null = null;

  constructor(private http: HttpClient) { }

  listAllOrders(): Observable<OrderInfo[]>
  {
    return this.http.get<OrderInfo[]>('api/orderlist');
  }
  /**
   * change appointment reservation status (in product model)
   */
  reserveAppointment(product: ProductDetails) : void
  {
    this.http.post<Appointment>('api/reserveAppointment', product);
  }
  /**
   * register an order with productID and a single appointment.
   */
  registerOrder(productId:string, appointmentIndex: Number): Observable<OrderInfo>
  {
    const postOrder: PostOrder = {productId, appointmentIndex};
    
    const orderObservable: Observable<OrderInfo> = this.http.post<OrderInfo>('api/registerOrder', postOrder);
    orderObservable.subscribe({
      next: (val) => {
        this.currentOrder = val;
      },
      error: (err) => {
        console.error(err);
      }
    });
    return orderObservable;
  }
  finalizeOrder(orderId:string): void
  {
    this.http.post<string>('api/finalizeOrder',orderId);
  }
}

