import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MessageResponse } from '../components/types';
import { PostOrder } from './order.service';


export enum PaymentType{
  HCIPAL,
  SWPSAFE,
  BACHELORCARD
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http:HttpClient) { }

  public getRightCountry(paymentType:PaymentType,account:string,merchantInfo:string):Observable<MessageResponse>
  {
    return this.http.post<MessageResponse>('api/payment/country',{paymentType,account,merchantInfo});
  }

  public getPaymentFinish(paymentType:PaymentType,postOrder:PostOrder,password:string,fullName?:string,merchantInfo?:string,expirationDate?:string):Observable<MessageResponse>
  {
    return this.http.post<MessageResponse>('api/payment/pay',{paymentType,postOrder,password,fullName,merchantInfo,expirationDate});
  }

}
