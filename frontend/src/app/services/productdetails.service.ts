import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductInfo } from './landingpage.service';


// Product details ist das gleich wie Product info nur mit zusätzliche Infos
export type ProductDetails = ProductInfo & {
  descritpion:string,
  duration:Date,
  timeslots:Date[]
}

export class ProductdetailsService {
  constructor(public http: HttpClient) {}

  getProductDetails(id:string): Observable<ProductDetails>
  {
    return this.http.get<ProductDetails>(`api/productdetails/${id}`);
  }
}
