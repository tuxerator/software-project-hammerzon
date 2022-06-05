import axios, { AxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import { PaymentType, SessionRequest } from '../types';
import {Request, Response} from 'express';
import OrderController from './orderCon';
import { HciPalOption } from './PaymentOptions/hcipaloption';
import { PaymentOption } from './PaymentOptions/paymentoption';








export class PaymentController
{
  order:OrderController;
  payOptions:{[key in PaymentType]:PaymentOption} = {
    [PaymentType.HCIPAL]:new HciPalOption()
  };


  constructor(order:OrderController){
    this.order = order;
  }

  public async IsFromGermany(request: SessionRequest,response: Response):Promise<void>
  {

    const accountName = request.body.accountName;// {accountName:'armin@admin.com'}

    const paymentType: PaymentType = request.body.paymentType;
    const paymentConfig = this.payOptions[paymentType];
    const countryConfig = paymentConfig.countryConfig(accountName);

   axios(countryConfig).then((axiosResponse)=>
   {
      const data = paymentConfig.countryParser(axiosResponse.data);
      if(!data.success)
      {
        response.status(403);
        response.send({message:'Bad Request'});
        return;
      }

      if(!(data.country === 'germany'))
      {
        response.status(403);
        response.send({message:'is not from germany'});
        return;
      }

      request.session.paymentAccount = {name:accountName,paymentType};
      response.status(200);
      response.send({message:'is from germany',code: 200});

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

    if(request.session.paymentAccount.paymentType !== paymentType)
    {
      response.status(403);
      response.send({message:'Wrong Payment Type'});
      return;
    }
    const pap = await this.order.getAppointProductPair(postOrder);

    if(!pap)
    {
      response.status(403);
      response.send({message:'Appointment is not available'});
      return;
    }
    console.log(pap);
                                                                      // Milliseconds to Hours
    const amount = pap.product.prize * (pap.product.duration.getTime() / (3600 * 1000));

    const paymentConfig = this.payOptions[paymentType];
    const checkConfig = paymentConfig.checkConfig(accountName,accountPassword,amount);
    try
    {

      const axiosResponse = await axios(checkConfig);
      console.log(axiosResponse);
      const data = paymentConfig.checkParser(axiosResponse.data);
      console.log(data);
      if(data.success){
        const payConfig = paymentConfig.payConfig(data.token);

        const axios2Response = await axios(payConfig);
        console.log(axios2Response);

        const data2 = paymentConfig.payParser(axios2Response.data);
        console.log(data2);
        if(data2.success)
        {
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
      response.status(403);
      response.send({message:error.response.data.error});
    }
  }


}
