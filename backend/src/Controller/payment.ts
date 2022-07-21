import axios from 'axios';
import { PaymentType, SessionRequest } from '../types';
import {Response} from 'express';
import { HciPalOption } from './PaymentOptions/hcipaloption';
import { CheckRequest, CountryRequest, PaymentOption } from './PaymentOptions/paymentoption';
import { BachelorOption } from './PaymentOptions/bacheloroption';
import { SwpSafeOption } from './PaymentOptions/swpsafeoption';
import { ActivityController } from './activity';
import { green, lightBlue } from '../Models/Activity';
import { order } from './orderCon';

// Controlls Payment of an Order/ a Service
export class PaymentController
{
  payOptions:{[key in PaymentType]:PaymentOption} = {
    [PaymentType.HCIPAL]:new HciPalOption(),
    [PaymentType.SWPSAFE]:new SwpSafeOption(),
    [PaymentType.BACHELORCARD]:new BachelorOption()
  };


  constructor(){
  }

  /**
   *
   * @param request
   * {
   *   account: 'name'
   *   paymentType: 'HCIPAL'
   * }
   * {
   *   account: 'full_name'
   *   cardNumber: 'card_number'
   *   merchantName: 'merchant_name'
   *   paymentType: 'BACHELORCARD' | 2
   * }
   * @param response
   */
  public async isFromGermany(request: SessionRequest,response: Response):Promise<void>
  {

    const paymentType: PaymentType = request.body.paymentType;
    // get the right payment config = (every information needed for a axios request)
    const paymentConfig = this.payOptions[paymentType];


    const req = new CountryRequest;
    req.account = request.body.account;
    req.merchantInfo = request.body.merchantInfo;

    const countryConfig = paymentConfig.countryConfig(req);

   axios(countryConfig).then((axiosResponse)=>
   {
      const data = paymentConfig.countryParser(axiosResponse.data);
      console.log(data);
      if(!data.success)
      {
        response.status(403);
        response.send({message:'Bad Request'});
        return;
      }

      if(!(data.country === 'germany' || data.country === 'Deutschland' || data.country === 'de'))
      {
        response.status(403);
        response.send({message:'Is not from germany'});
        return;
      }

      request.session.paymentAccount = {account:req.account,paymentType};
      response.status(200);
      response.send({message:'Is from germany',code: 200});

   }).catch((error) =>
   {
      console.log(error);

      const data = paymentConfig.errorParser(error.response);
      response.status(403);
      response.send({message:data.error});
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
  public async payment(request: SessionRequest, response: Response): Promise<void>
  {
    const postOrder = request.body.postOrder;
    //const accountPassword = request.body.password;
    //const accountName = request.session.paymentAccount.name;
    const paymentType: PaymentType = request.body.paymentType;
    // If it is not the same PaymentType than the given type from our country test
    if(request.session.paymentAccount.paymentType !== paymentType)
    {
      request.session.paymentAccount = undefined;
      // send error
      response.status(403);
      response.send({message:'Wrong Payment Type'});
      return;
    }

    // Get the Product Appointment Pair form the db
    const pap = await order.getAppointProductPair(postOrder);
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

    const req = new CheckRequest();
    req.account = request.session.paymentAccount.account;
    req.expirationDate = request.body.expirationDate;
    req.fullName = request.body.fullName;
    req.merchantInfo = request.body.merchantInfo;
    req.password = request.body.password;


    const checkConfig = paymentConfig.checkConfig(req,amount);
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
          const orderObj = await order.registerOrder(pap,request.session.user);
          response.status(200);

          ActivityController.addActivity(request.session.user,[green('bestellte'),' das Product ',lightBlue(pap.product.name), 'mit der #' ,lightBlue(orderObj.id.toString())]);

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
      const data = paymentConfig.errorParser(error.response.data);
      // TO DO: parseError To Right json-format/js-object
      response.send({message:data.error});
    }

    //request.session.paymentAccount = undefined;
  }


}


export const payment = new PaymentController();
