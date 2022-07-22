import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { CheckRequest, CountryRequest, PaymentError, PaymentOption, Success } from './paymentoption';


// Information of an HciPal Payment Option
export class HciPalOption implements PaymentOption {

  URL='https://pass.hci.uni-konstanz.de/hcipal/';

  public countryConfig(req:CountryRequest):AxiosRequestConfig
  {
    return {
      url: this.URL + 'country',
      method:'post',
      data: {accountName : req.account}
    };
  }

  public countryParser(data: any): Success & { country: string } {
    return { success: data.success, country: data.country };
  }

  public checkConfig(req:CheckRequest,amount:number):AxiosRequestConfig
  {
    return {
      url: this.URL + 'check',
      method:'post',
      data:{accountName : req.account,accountPassword:req.password,amount},
    };
  }

  public checkParser(data: any): Success & { token: string } {
    return { success: data.success, token: data.token };
  }

  public payConfig(token:string):AxiosRequestConfig
  {
    return {
      url: this.URL + 'payment',
      method:'post',
      data:{token},
    };
  }

  public payParser(data:any) : Success
  {
    return {success:data.success};
  }

  public errorParser(data: any) : PaymentError
  {
    return {error : data.error};
  }
}
