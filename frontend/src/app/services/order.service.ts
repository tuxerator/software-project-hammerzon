import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, Status } from '../models/Order';

export type PostOrder={
  productId : string,
  appointmentIndex : number
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) {
  }

  listAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>('api/admin/order/list');
  }

  listAllOrdersByUser(): Observable<Order[]> {
    return this.http.get<Order[]>('api/order/list');
  }

  /**
   * register an order with productID and a single appointment.
   */
  registerOrder(productId: string, appointmentIndex: number) : Observable<Boolean>
  {
    const postOrder: PostOrder = {productId, appointmentIndex};
    return this.http.post<Boolean>('api/order/register', postOrder);
  }

  /**
   * deletes an order when it is cancelled
   */
  deleteOrder(orderId: string): Observable<void> {
    return this.http.delete<void>(`api/order/delete/${ orderId }`);
  }

  /**
   * resets the isReserved status of an appointment to false
   */
  resetProduct(productId:string, appointmentIndex:number) : Observable<PostOrder>
  {
    const postOrder:PostOrder = {productId, appointmentIndex};
    console.log('reset appointment service');
    return this.http.post<PostOrder>('api/resetAppointment', postOrder);
  }

  setStatus(orderId:string, status: Status) : Observable<Status>
  {
    console.log('toggle service:' + status);
    return this.http.post<Status>(`/api/order/${orderId}/setStatus`, {status});
  }

}

