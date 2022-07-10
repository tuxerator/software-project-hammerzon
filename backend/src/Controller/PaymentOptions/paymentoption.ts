import axios, { AxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import { BachelorCardRequest, HciPalSWPRequest, PaymentType } from '../../types';

export type Success = {success:boolean}
export type PaymentError = {error:string}

/**
 * the CountryRequest is an object that is received by
 * our backend. it needs to be converted to the specific
 * data format of the payment option. The Homecountry of 
 * the user is checked before anything else.
 */
export class CountryRequest{
                            account:string;
                            merchantInfo?:string;
                          }
/**
 * The CheckRequest also needs to be converted, like
 * the CountryRequest. It contains data about the payment
 * account of the User, which is then checked by the external 
 * payment API, do determine if the account is valid.
 */
export class CheckRequest {
                            account:string;
                            password:string;
                            fullName?:string;
                            merchantInfo?:string;
                            expirationDate?:Date;
                          }

/**
 * This interface defines the methods a paymentoption adapter needs to implement 
 * to communicate with the payment controller
 */
export interface PaymentOption{
   countryConfig: (req: CountryRequest)=>AxiosRequestConfig,
   countryParser: (data:any) => Success & {country:string},
   checkConfig: (req : CheckRequest,amount:number)=>AxiosRequestConfig,
   checkParser: (data:any) => Success & {token:string,merchantInfo?:string},
   payConfig: (token:string) => AxiosRequestConfig,
   payParser: (data:any) => Success,
   errorParser: (data:any) => PaymentError
}
