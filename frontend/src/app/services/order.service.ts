import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export type OrderList<T>={
  list: T[]
}

export type OrderInfo={
  product : string,
  orderingUser: string,
  timeOfOrder: Date,
  finalized: boolean,
  timeslot: Date
}
export type PostOrder={
  productId : string,
  timeslot: Date
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  public currentOrder :OrderInfo|null = null;

  constructor(private http: HttpClient) { }

  listAllOrders(): Observable<OrderList<OrderInfo>>
  {
    return this.http.get<OrderList<OrderInfo>>('api/orderlist');
  }

  registerOrder(productId:string, timeslot:Date): Observable<OrderInfo>
  {
    const postOrder: PostOrder = {productId, timeslot};
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
}

