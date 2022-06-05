import axios, { AxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import { PaymentType, SessionRequest } from '../types';
import {Request, Response} from 'express';
import OrderController from './orderCon';
import { HciPalOption } from './PaymentOptions/hcipaloption';
import { PaymentOption } from './PaymentOptions/paymentoption';
import { SwpSafeOption } from './PaymentOptions/swpsafeoption';

// Controlls Payment of an Order/ a Service
export class PaymentController
{
  order:OrderController;
  payOptions:{[key in PaymentType]:PaymentOption} = {
    [PaymentType.HCIPAL]:new HciPalOption(),
    [PaymentType.SWPSAFE]:new SwpSafeOption()
  };


  constructor(order:OrderController){
    this.order = order;
  }
  // Tests wether the account form a given PaymentType is from germany
  public async IsFromGermany(request: SessionRequest,response: Response):Promise<void>
  {
    const accountName = request.body.accountName;// {accountName:'armin@admin.com'}

    const paymentType: PaymentType = request.body.paymentType;
    // get the right payment config = (every information needed for a axios request)
    const paymentConfig = this.payOptions[paymentType];
    // get Information for country check
    const countryConfig = paymentConfig.countryConfig(accountName);
    // request the check
   axios(countryConfig).then((axiosResponse)=>
   {
      // parse the response into a json-format/javascript-object
      const data = paymentConfig.countryParser(axiosResponse.data);

      if(!data.success)
      {
        response.status(403);
        response.send({message:'Bad Request'});
        return;
      }
      // if its not germany send error
      if(!(data.country === 'germany'))
      {
        response.status(403);
        response.send({message:'Is not from germany'});
        return;
      }
      // Else save these information in the session so we can use them later
      request.session.paymentAccount = {name:accountName,paymentType};
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
   * request: postOrder
   *          accountPassword
   *          accountName
   *          paymentType
   */
  public async Payment(request: SessionRequest,response: Response): Promise<void>
  {
    const postOrder = request.body.postOrder;
    const accountPassword = request.body.password;
    const accountName = request.session.paymentAccount.name;
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
    // Get Information needed for check request
    const checkConfig = paymentConfig.checkConfig(accountName,accountPassword,amount);
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
      // TO DO: parseError To Right json-format/js-object
      response.send({message:error.response.data.error});
    }
  }


}
