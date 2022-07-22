import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Order, Status } from '../models/Order';
import { Availability, Product } from '../models/Product';
import { MessageResponse } from '../components/types';
import { Socket } from 'ngx-socket-io';

export type PostOrder = {
  productId: string,
  appointment: Availability
}

export type AppointemntAction = {
  appointment: Availability,
  action: 'add' | 'remove';
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  public appointmentChanged = new Subject<AppointemntAction>();

  constructor(private http: HttpClient, private socket: Socket) {

  }

  private _currentlySelectedAppointment?: Availability;

  get currentlySelectedAppointment(): Availability | undefined {
    return this._currentlySelectedAppointment;
  }

  set currentlySelectedAppointment(value: Availability | undefined) {
    this._currentlySelectedAppointment = value;
  }

  getAppointmentChanged(product: Product): Observable<AppointemntAction> {
    this.socket.on(`${ product.user!._id }:appointment`, (data: AppointemntAction) => {
      console.log('New appointment received:\nchannel: %o\ndata: %o', product.user!._id, data);
      this.appointmentChanged.next(data);
    });
    return this.appointmentChanged;
  }

  listAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>('api/admin/order/list');
  }

  listAllOrdersByUser(): Observable<Order[]> {
    return this.http.get<Order[]>('api/order/list');
  }

  listOrdersByProductCreator() : Observable<Order[]> {
    return this.http.get<Order[]>('api/order/listByCreator');
  }

  validateOrder(productId: string, appointment: Availability): Observable<MessageResponse> {
    const postOrder: PostOrder = { productId, appointment };
    return this.http.post<MessageResponse>('api/order/validate', postOrder);
  }

  /**
   * register an order with productID and a single appointment.
   */
  addOrder(productId: string, appointment: Availability): Observable<MessageResponse & { orderRegistered: Boolean }> {
    const postOrder: PostOrder = { productId, appointment };
    return this.http.post<MessageResponse & {orderRegistered:Boolean}>('api/order/add', postOrder);
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
  /*resetProduct(productId:string, appointmentIndex:number) : Observable<PostOrder>
  {
    //const postOrder:PostOrder = {productId, appointmentIndex};
    console.log('reset appointment service');
    return this.http.post<PostOrder>('api/resetAppointment', postOrder);
  }*/

  setStatus(orderId: string, status: Status): Observable<Status> {
    console.log('toggle service:' + status);
    return this.http.post<Status>(`/api/order/${ orderId }/setStatus`, { status });
  }

  getAvailabilityList(productId: string): Observable<Availability[]> {
    return this.http.get<Availability[]>(`api/product/${ productId }/availability/list`);
  }


  validateAppointment(productId: string, appointment: Availability): Observable<MessageResponse> {
    return this.http.post<MessageResponse>('api/order/validate', { postOrder:{productId, appointment }});
  }

}

