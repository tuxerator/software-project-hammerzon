import axios, { AxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import { PaymentType } from '../../types';

export type Success = {success:boolean}

export interface PaymentOption{
   countryConfig: (accountName:string)=>AxiosRequestConfig,
   countryParser: (data:any) => Success & {country:string},
   checkConfig: (accountName:string,password:string,amount:number)=>AxiosRequestConfig,
   checkParser: (data:any) => Success & {token:string},
   payConfig: (token:string) => AxiosRequestConfig,
   payParser: (data:any) => Success
}
