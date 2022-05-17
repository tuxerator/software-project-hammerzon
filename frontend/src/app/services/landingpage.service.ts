import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/Product';

export type ListInfo<T>={
    list: T[],
    requestable:number
}

@Injectable({
  providedIn: 'root'
})
export class LandingpageService {

  constructor(private http: HttpClient) {}
  // Lässt sich vom Server die ProductInfos die zwischen start und start+limit liegen
  // und e ine zusätzliche Informationen ist requestable, also wie viele elemente es noch bis zum ende in der Liste gibt, geben
  // z.b für die Liste [0,1,2,3] ließ er sich mit start = 1 und limit = 2
  //     die Liste [1,2] geben und requestable wäre 1 also {list:[1,2] requestable:1} (vom Type ListInfo<number>)
  getProductList(start:number = 0, limit:number = 10): Observable<ListInfo<Product>>  {
    console.log('Hallo ich komm dahin');
    return this.http.get<ListInfo<Product>>(`api/productlist?start=${start}&limit=${limit}`);
  }
}
