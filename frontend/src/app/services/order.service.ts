import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
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
   * register an order with productID and a single appointment.
   */
  registerOrder(productId:string, appointmentIndex: Number): Observable<OrderInfo>
  {
    const postOrder: PostOrder = {productId, appointmentIndex};
    
    return this.http.post<OrderInfo>('api/registerOrder', postOrder);
    /*
    orderObservable.subscribe(
      {
      next: (val) => {
        this.currentOrder = val;
      },
      error: (err) => {
        console.error(err);
      }
      }
      );
    return orderObservable;
    */
  }
  /**
   * deletes an order when it is cancelled
   */
  deleteOrder(orderId:string) : Observable<void>
  {
    return this.http.delete<void>(`api/deleteOrder/${orderId}`);
  }
  /**
   * resets the isReserved status of an appointment to false
   */
  resetProduct(productId:string, appointmentIndex:Number) : Observable<PostOrder>
  {
    const postOrder:PostOrder = {productId, appointmentIndex};
    console.log('reset appointment service');
    return this.http.post<PostOrder>('api/resetAppointment', postOrder);
  }

  finalizeOrder(orderId:string): Observable<OrderInfo>
  {
    return this.http.post<OrderInfo>(`api/finalizeOrder/${orderId}`,orderId);
  }
}

