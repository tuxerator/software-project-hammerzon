import axios, { AxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import { BachelorCardRequest, HciPalSWPRequest, PaymentType } from '../../types';

export type Success = {success:boolean}

export class CountryRequest{
                            account:string;
                            merchantInfo?:string;
                          }
export class CheckRequest {
                            account:string;
                            password:string;
                            fullName?:string;
                            merchantInfo?:string;
                            expirationDate?:Date;
                          }
//export type Error = {}

export interface PaymentOption{
   countryConfig: (req: CountryRequest)=>AxiosRequestConfig,
   countryParser: (data:any) => Success & {country:string},
   checkConfig: (req : CheckRequest,amount:number)=>AxiosRequestConfig,
   checkParser: (data:any) => Success & {token:string,merchantInfo?:string},
   payConfig: (token:string) => AxiosRequestConfig,
   payParser: (data:any) => Success
}
