import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/Product';
@Injectable({
  providedIn: 'root'
})
export class AddProductService {
  public product: Product|null=null;

  constructor(private http:HttpClient) { }

  addProduct(product:Product):Observable<string>
  {
     return this.http.post<string>('api/productCon/addProduct',product);
  }
}
