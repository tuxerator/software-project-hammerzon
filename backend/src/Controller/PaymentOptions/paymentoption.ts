import axios, { AxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import { BachelorCardRequest, HciPalSWPRequest, PaymentType } from '../../types';

export type Success = {success:boolean}

export interface PaymentOption{
   countryConfig: (req: HciPalSWPRequest | BachelorCardRequest)=>AxiosRequestConfig,
   countryParser: (data:any) => Success & {country:string},
   checkConfig: (req : HciPalSWPRequest | BachelorCardRequest,amount:number)=>AxiosRequestConfig,
   checkParser: (data:any) => Success & {token:string},
   payConfig: (token:string) => AxiosRequestConfig,
   payParser: (data:any) => Success
}
