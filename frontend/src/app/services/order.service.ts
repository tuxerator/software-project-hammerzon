import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type OrderList<T>={
  list: T[]
}

export type OrderInfo={
  //product: string,
  orderingUser: string,
  timeOfOrder: string
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  listAllOrders(): Observable<OrderList<OrderInfo>>
  {
    return this.http.get<OrderList<OrderInfo>>('api/orderlist');
  }
}
