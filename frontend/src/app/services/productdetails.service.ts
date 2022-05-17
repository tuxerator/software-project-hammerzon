import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Product } from '../models/Product';

// Product details ist das gleich wie Product info nur mit zusätzliche Infos

export type Appointment = {
  date : Date,
  isReserved : Boolean
}

@Injectable({
  providedIn: 'root'
})
export class ProductdetailsService {
  constructor(public http: HttpClient) {}

  getProductDetails(id:string): Observable<Product>
  {
    console.log(id);
    return this.http.get<Product>(`api/productdetails/${id}`);
  }
}
