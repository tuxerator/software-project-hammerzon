import { AxiosRequestConfig } from 'axios';
import { HciPalSWPRequest } from '../../types';
import { CheckRequest, CountryRequest, PaymentError, PaymentOption, Success } from './paymentoption';

export class SwpSafeOption implements PaymentOption {

  URL='https://pass.hci.uni-konstanz.de/swpsafe/';

  public CsvToJson(text:string):any
  {
    const lines = text.split('\n');
    //const grid = lines.map(line => line.split(','));
    const keys = lines[0].split(',');
    const objs = [];
    for(let i = 1; i < lines.length; i++)
    {
      const line = lines[i].split(',');
      const obj:{[key:string]:string}={};

      for(let j = 0; j < keys.length; j++)
      {
        obj[keys[j]] = line[j];
      }

      objs.push(obj);
    }
  }

  public countryConfig(req:CountryRequest):AxiosRequestConfig
  {
    return {
      url: this.URL + `country/code/${encodeURIComponent(req.account)}`,
      method:'get'
    };
  }

  public countryParser(data:any) : Success & {country:string}
  {
    const obj = this.CsvToJson(data)[0];
    return {success:obj.success,country:obj.country};
  }

  public checkConfig(req:CheckRequest,amount:number):AxiosRequestConfig
  {
    return {
      url: this.URL + `check/code/${encodeURIComponent(req.account)}/amount/${encodeURIComponent(amount)}`,
      method:'get',
    };
  }

  public checkParser(data:any):Success & {token:string}
  {
    const obj = this.CsvToJson(data)[0];
    return {success:obj.success,token:obj.token};
  }

  public payConfig(token:string):AxiosRequestConfig
  {
    return {
      url: this.URL + `/use/${encodeURIComponent(token)}`,
      method:'get',
    };
  }

  public payParser(data:any) : Success
  {
    const obj = this.CsvToJson(data)[0];
    return {success:obj.success};
  }

  public errorParser: (data: any) => PaymentError;
}
