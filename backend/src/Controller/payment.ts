import axios, { AxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import { PaymentType, SessionRequest } from '../types';
import {Request, Response} from 'express';
import OrderController from './orderCon';
import { HciPalOption } from './PaymentOptions/hcipaloption';
import { PaymentOption } from './PaymentOptions/paymentoption';
import { BachelorOption } from './PaymentOptions/bacheloroption';
import { xml2json } from 'xml-js';







import { SwpSafeOption } from './PaymentOptions/swpsafeoption';

// Controlls Payment of an Order/ a Service
export class PaymentController
{
  order:OrderController;
  payOptions:{[key in PaymentType]:PaymentOption} = {
    [PaymentType.HCIPAL]:new HciPalOption(),
    [PaymentType.SWPSAFE]:new SwpSafeOption(),
    [PaymentType.BACHELORCARD]:new BachelorOption()
  };


  constructor(order:OrderController){
    this.order = order;
  }

  /**
   * 
   * @param request   
   * {
   *   accountName: 'name'
   *   paymentType: 'HCIPAL'            
   * }
   * {
   *   accountName: 'full_name'
   *   cardNumber: 'card_number'
   *   merchantName: 'merchant_name'
   *   paymentType: 'BACHELORCARD' | 1
   * }
   * @param response 
   */
  public async IsFromGermany(request: SessionRequest,response: Response):Promise<void>
  {

    const req = request.body;// {accountName:'armin@admin.com'}
    const paymentType: PaymentType = request.body.paymentType;
    // get the right payment config = (every information needed for a axios request)
    const paymentConfig = this.payOptions[paymentType];
    const countryConfig = paymentConfig.countryConfig(req);
   axios(countryConfig).then((axiosResponse)=>
   {
      console.log(axiosResponse.data);
      const data = paymentConfig.countryParser(axiosResponse.data);

      if(!data.success)
      {
        response.status(403);
        response.send({message:'Bad Request'});
        return;
      }

      if(!(data.country === 'germany' || data.country === 'de'))
      {
        response.status(403);
        response.send({message:'Is not from germany'});
        return;
      }

      request.session.paymentAccount = {name:req.accountName,paymentType};
      response.status(200);
      response.send({message:'Is from germany',code: 200});

   }).catch((error) =>
   {
      response.status(403);
      response.send({message:error.response.data.error});
   });
  }
  // MiddelWare => isRequired Password + (Session.paymentAccount Correct Account)
  /**
   * request: 
   * - hcipal, swpsafe
   * postOrder
   * accountPassword
   * accountName
   * paymentType
   * - bachelorcard
   * postOrder
   * merchantname
   * cardNumber
   * fullName
   * securityCode
   * expirationDate
   * paymentType
   * 
   */
  public async Payment(request: SessionRequest,response: Response): Promise<void>
  {
    const postOrder = request.body.postOrder;
    //const accountPassword = request.body.password;
    //const accountName = request.session.paymentAccount.name;
    const paymentType: PaymentType = request.body.paymentType;
    // If it is not the same PaymentType than the given type from our country test
    if(request.session.paymentAccount.paymentType !== paymentType)
    {
      // send error
      response.status(403);
      response.send({message:'Wrong Payment Type'});
      return;
    }
    // Get the Product Appointment Pair form the db
    const pap = await this.order.getAppointProductPair(postOrder);
    // If it does not exist or the appointment is reserved
    if(!pap)
    {
      // send error
      response.status(403);
      response.send({message:'Appointment is not available'});
      return;
    }
    console.log(pap);
    // Calculate amount / totalprice for product
                                                                      // Milliseconds to Hours
    const amount = pap.product.prize * (pap.product.duration.getTime() / (3600 * 1000));
    // get the right payment config = (every information needed for a axios request)
    const paymentConfig = this.payOptions[paymentType];
    // add a new RequestType in types.ts for more payment options
    const checkConfig = paymentConfig.checkConfig(request.body,amount);
    console.log(checkConfig);
    try
    {
      const axiosResponse = await axios(checkConfig);
      console.log(axiosResponse);
      // parse response into a json-format/javascript-object
      const data = paymentConfig.checkParser(axiosResponse.data);
      console.log(data);

      if(data.success){
        // get Information for pay-request
        const payConfig = paymentConfig.payConfig(data.token);

        const axios2Response = await axios(payConfig);
        console.log(axios2Response);
        // parse response into a json-format/javascript-object
        const data2 = paymentConfig.payParser(axios2Response.data);
        console.log(data2);
        // if sccessfull
        if(data2.success)
        {
          // register Order and send response
          await this.order.registerOrder(pap,request.session.user);
          response.status(200);
          response.send({message:'Payment Successfull'});
        }else{
          response.status(403);
          response.send({message:'Bad Request'});
        }
      }else{
        response.status(403);
        response.send({message:'Bad Request'});
      }
    }catch(error){
      // Errors from axois and co
      response.status(403);
      console.log(error);
      // TO DO: parseError To Right json-format/js-object
      response.send({message:error.response.data.error});
    }
  }


}
