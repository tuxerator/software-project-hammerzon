import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductInfo } from './landingpage.service';
import { Injectable } from '@angular/core';

// Product details ist das gleich wie Product info nur mit zusätzliche Infos
export type ProductDetails = ProductInfo & {
  descritpion:string,
  duration:Date,
  timeslots:Date[]
}

@Injectable({
  providedIn: 'root'
})
export class ProductdetailsService {
  constructor(public http: HttpClient) {}

  getProductDetails(id:string): Observable<ProductDetails>
  {
    console.log(id);
    return this.http.get<ProductDetails>(`api/productdetails/${id}`);
  }
}
