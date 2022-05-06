import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export type Product={
  name: string,
  user: string,
  prize: number,

  currency: '€/hr'
}

@Injectable({
  providedIn: 'root'
})
export class LandingpageService {

  constructor(private http: HttpClient) { }
  
  public getProductName(name:string): Observable <Product>{
    return this.http.get<Product>('api/'+name);
  }

}
