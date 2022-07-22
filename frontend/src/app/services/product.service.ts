import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IdMessageResponse, ListInfoReponse, MessageResponse } from '../components/types';
import { Product, Rating } from '../models/Product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  public product: Product | null = null;

  constructor(private http: HttpClient) {
  }

  getProductDetails(id: string): Observable<Product> {
    console.log(id);
    return this.http.get<Product>(`api/product/${ id }`);
  }

  // Lässt sich vom Server die ProductInfos die zwischen start und start+limit liegen
  // und e ine zusätzliche Informationen ist requestable, also wie viele elemente es noch bis zum ende in der Liste gibt, geben
  // z.b für die Liste [0,1,2,3] ließ er sich mit start = 1 und limit = 2
  //     die Liste [1,2] geben und requestable wäre 1 also {list:[1,2] requestable:1} (vom Type ListInfo<number>)
  getProductList(start: number = 0, limit: number = 10, search: string = '',categoryName:string = ''): Observable<ListInfoReponse<Product>> {
    console.log('Hallo ich komm dahin');
    let url = 'api/product/list';

    url += `?start=${ start }&limit=${ limit }}`;

    if(search !== '')
    {
      search = encodeURIComponent(search);
      url += `&search=${search}`;
    }

    if(categoryName !== '')
    {
      categoryName = encodeURIComponent(categoryName);
      url += `&category=${categoryName}`;
    }

    return this.http.get<ListInfoReponse<Product>>(url);

  }

  addProduct(product: Product): Observable<IdMessageResponse> {
    return this.http.post<IdMessageResponse>('api/product/add', product);
  }

  removeProduct(id:string):Observable<MessageResponse>
  {
    return this.http.delete<MessageResponse>(`api/product/delete/${ id }`);
  }

  getSimilarProducts(id:string):Observable<ListInfoReponse<Product>>
  {
    return this.http.get<ListInfoReponse<Product>>(`api/product/similar/${id}`);
  }

  submitRating(id:string, rating:Rating) : Observable<Product>
  {
    return this.http.post<Product>(`api/product/${id}/rate`, {rating});
  }

  updateRating(id : string, rating : Rating) : Observable<Product>
  {
    return this.http.post<Product>(`api/product/${id}/updateRating`, {rating});
  }

  hasOrdered(id:string) : Observable<boolean>
  {
    return this.http.get<boolean>(`api/product/${id}/canRate`);
  }

  hasRated(id:string) : Observable<boolean>
  {
    return this.http.get<boolean>(`api/product/${id}/hasRated`);
  }
}

