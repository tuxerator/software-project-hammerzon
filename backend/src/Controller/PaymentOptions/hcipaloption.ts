import { AxiosRequestConfig } from 'axios';
import { HciPalRequest } from '../../types';
import { PaymentOption, Success } from './paymentoption';


export class HciPalOption implements PaymentOption {

  URL='https://pass.hci.uni-konstanz.de/hcipal/';

  public countryConfig(req:any):AxiosRequestConfig
  {
    return {
      url: this.URL + 'country',
      method:'post',
      data: {accountName : req.accountName}
    };
  }

  public countryParser(data:any) : Success & {country:string}
  {
    return {success:data.success,country:data.country};
  }

  public checkConfig(req: HciPalRequest,amount:number):AxiosRequestConfig
  {
    return {
      url: this.URL + 'check',
      method:'post',
      data:{accountName : req.accountName,accountPassword:req.accountPassword,amount},
    };
  }

  public checkParser(data:any):Success & {token:string}
  {
      return {success:data.success,token:data.token};
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
}
