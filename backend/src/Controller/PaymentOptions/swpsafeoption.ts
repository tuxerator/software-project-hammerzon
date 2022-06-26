import { AxiosRequestConfig } from 'axios';
import { HciPalSWPRequest } from '../../types';
import { CheckRequest, CountryRequest, PaymentError, PaymentOption, Success } from './paymentoption';

export class SwpSafeOption implements PaymentOption {

  URL='https://pass.hci.uni-konstanz.de/swpsafe/';

  public CsvToJson(text:string):any
  {
    console.log(text);
    const lines = text.split('\n');
    //const grid = lines.map(line => line.split(','));
    console.log(lines);
    console.log(lines[0]);
    const keys = lines[0].split(',').filter(x => x !== 'tracker_id');
    console.log(keys);

    const objs = [];
    for(let i = 1; i < lines.length; i++)
    {
      const line = lines[i].split(',');
      console.log(line);
      const obj:{[key:string]:string}={};
      if(line.length >= keys.length)
      {
        for(let j = 0; j < keys.length; j++)
        {
          console.log(line[j]);
          obj[keys[j]] = line[j].replace('"','').replace('"','');
        }
        console.log(obj);
        objs.push(obj);
      }
    }
    return objs;
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
    console.log(obj);
    if(obj.responseCode === '200')
    {
      return {success:true,country:obj.country};
    }
    return {success:false,country:obj.country};
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
    if(obj.status === '200')
    {
      return {success:true,token:obj.token};
    }
    return {success:false,token:obj.token};
  }

  public payConfig(token:string):AxiosRequestConfig
  {
    return {
      url: this.URL + `use/${encodeURIComponent(token)}`,
      method:'get',
    };
  }

  public payParser(data:any) : Success
  {
    const obj = this.CsvToJson(data)[0];
    if(obj.status === '200')
    {
      return {success:true};
    }
    return {success:false};
  }

  public errorParser(data: any) : PaymentError
  {
    const obj:any = this.CsvToJson(data)[0];
    return {error:obj.errormessage};
  }
}
