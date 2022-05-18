import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/Order';

export type PostOrder={
  productId : string,
  appointmentIndex : Number
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  listAllOrders(): Observable<Order[]>
  {
    return this.http.get<Order[]>('api/orderlist');
  }

  listAllOrdersByUser() : Observable<Order[]>
  {
    return this.http.get<Order[]>('api/orderlistbyuser');
  }
  /**
   * register an order with productID and a single appointment.
   */
  registerOrder(productId: string, appointmentIndex: Number) : Observable<Order>
  {
    const postOrder: PostOrder = {productId, appointmentIndex};
    return this.http.post<Order>('api/registerOrder', postOrder);
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

  finalizeOrder(orderId:string): Observable<Order>
  {
    return this.http.post<Order>(`api/finalizeOrder/${orderId}`,orderId);
  }
}

