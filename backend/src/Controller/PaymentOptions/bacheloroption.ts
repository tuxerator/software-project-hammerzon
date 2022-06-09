import { AxiosRequestConfig } from 'axios';
import { CheckRequest, CountryRequest, PaymentOption, Success } from './paymentoption';
import { xml2js } from 'xml-js';
import { BachelorCardRequest } from '../../types';

export class BachelorOption implements PaymentOption {

  URL = 'https://pass.hci.uni-konstanz.de/bachelorcard';
  merchantName = '';
  public countryConfig(req: CountryRequest): AxiosRequestConfig {
    const xmldata =
      `
        <?xml version="1.0" encoding="utf-8"?>
        <transactionRequest type="country">
        <version>1.0.0</version>
        <merchantInfo>
            <name>${req.merchantInfo}</name>
        </merchantInfo>
        <cardNumber>${req.account}</cardNumber>
        </transactionRequest>
      `;

    return {
      url: this.URL,
      method: 'post',
      data: xmldata,
      headers: {'Content-Type': 'application/xml'}
    };
  }

  public countryParser(data:any) : Success & {country:string}
  {
    const obj : any = xml2js(data, {compact : true});
    const response = obj.transactionResponse.response;
    const country = response['transaction-data'].country._text;
    console.log(country);
    if(response.status._text === '200: Success'){
      return {success : true, country : country};
    }
    else{
      return {success : false, country : country};
    }
  }
  public checkConfig(req : CheckRequest, amount:number) : AxiosRequestConfig
  {
    this.merchantName = req.merchantInfo;
    const xmldata =
      `
      <?xml version="1.0" encoding="utf-8"?>
      <transactionRequest type="validate">
      <version>1.0.0</version>
      <merchantInfo>
          <name>${req.merchantInfo}</name>
      </merchantInfo>
      <payment type="bachelorcard">
          <paymentDetails>
              <cardNumber>${req.account}</cardNumber>
              <name>${req.fullName}</name>
              <securityCode>${req.password}</securityCode>
              <expirationDate>${req.expirationDate}</expirationDate>
          </paymentDetails>
          <dueDetails>
              <amount>${amount}</amount>
              <currency>EUR</currency>
              <country>de</country>
          </dueDetails>
      </payment>
      </transactionRequest>
      `;
    return {
      url : this.URL,
      method : 'post',
      data : xmldata,
      headers: {'Content-Type': 'application/xml'}
    };
  }

  public checkParser(data:any): Success & {token:string}
  {
    const obj : any = xml2js(data, {compact : true});
    const response = obj.transactionResponse.response;
    if(response.status._text === '200: Success'){
      const code = response['transaction-data'].transactionCode._text;
      console.log(code);
      return {success : true, token : code};
    }
    else{

      return {success : false, token : ''};
    }
  }


  public payConfig(token:string):AxiosRequestConfig
  {
    const xmldata =
      `
      <?xml version="1.0" encoding="utf-8"?>
      <transactionRequest type="pay">
      <version>1.0.0</version>
      <merchantInfo>
          <name>${this.merchantName}</name>
      </merchantInfo>
      <transactionCode>${token}</transactionCode>
      </transactionRequest>
      `;

      return {
        url : this.URL,
        method : 'post',
        data : xmldata,
        headers: {'Content-Type': 'application/xml'}
      };
  }

  public payParser(data:any) : Success
  {
    const obj : any = xml2js(data, {compact : true});
    const response = obj.transactionResponse.response;
    if(response.status._text === '200: Success'){
      return {success : true};
    }
    else{
      return {success : false};
    }
  }

}
