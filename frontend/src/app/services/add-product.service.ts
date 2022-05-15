import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/Product';
import { IdMessageResponse } from '../components/types';
@Injectable({
  providedIn: 'root'
})
export class AddProductService {
  public product: Product|null=null;

  constructor(private http:HttpClient) { }

  addProduct(product:Product):Observable<IdMessageResponse>
  {
    return this.http.post<IdMessageResponse>('api/addproduct',product);
  }
}
