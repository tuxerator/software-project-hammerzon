import { IProduct, IRating, Product } from '../Models/Product';
import { SessionRequest } from '../types';
import { Types } from 'mongoose';
import { Response } from 'express';
import { IUser } from '../Models/User';
import { IOrder } from '../Models/Order';
import { Order } from '../Models/Order';
import mongoose from 'mongoose';
import { Session } from 'express-session';

class RatingController {
  /**
   * add a rating to a product
   * validate: - rating is between 1 and 5
   *           - user has ordered the product
   * @param request - productid as route parameter
   * {
   *   rating: Rating
   * }
   * Rating {
   *  rating:number,
   *  comment:string,
   * }
   * @param response  -> updated product
   */
  public async addRating(request: SessionRequest, response: Response): Promise<void> {
    const id = request.params.id;
    const user = request.session.user._id;
    this.hasOrdered(user, id).then(async (result) => {
      if(result)
      {
        const newRating = request.body.rating.rating;
        if (id && Types.ObjectId.isValid(id)) {
          const product : IProduct = await (await Product.findById(id)).populate('ratings.user', '-password');
          // update the average rating
          const numberOfRatings = product.numberOfRatings;
          const rating = product.averageRating;
          product.averageRating = ((rating * numberOfRatings)+newRating)/(numberOfRatings+1);
          product.numberOfRatings++;
          // add the rating to the array in the product
          const add  : IRating = {_id : new mongoose.Types.ObjectId(),
            ...request.body.rating,
             user,date:new Date()};

          product.ratings = [add, ... product.ratings];
          console.log(product.ratings);
          product.save();
          const returnProduct : any = product;
          console.log(numberOfRatings);
          console.log(returnProduct.ratings);
          returnProduct.ratings[0].user = request.session.user;
          response.status(200);
          response.send(returnProduct);
        }
        else {
          response.status(500);
          response.send('there is no order with such an id');
        }
      }
      else {
        response.status(500);
        response.send('this user did not order the product');
      }

    });
  }

  /**
   * checks if the user has ordered the product
   * intended usage in the other methods in this class
   * @param user        - current user from the session request
   * @param productID   - id of the product
   * @returns
   */
  private async hasOrdered(user : mongoose.Types.ObjectId, productID : string) : Promise<boolean> {
    const id = user;
    console.log(productID);
    const orders : IOrder[] = await Order.find({oderingUser : id});
    for(const order of  orders) {
      console.log(order.product);
      if(order.product.toString() === productID) {
        return true;
      }
    }

    return false;
  }

  /**
   * checks if the user has ordered the product
   * intended usage in the frontend
   * gets the productID as a route parameter
   * @param request
   * @param response
   */
  public async canRate(request: SessionRequest, response: Response) : Promise<void> {
    const id = request.session.user._id;
    const productID = request.params.id;
    if(id && Types.ObjectId.isValid(id))
    {
      const orders : IOrder[] = await Order.find({oderingUser : id});
      for(const order of  orders) {
        if(order.product.toString() === productID) {
          response.status(200);
          response.send(true);
          return;
        }
      }
    }
    response.status(200);
    response.send(false);
  }

  /**
   * checks if the user has already rated the product
   * @param request
   * @param response
   */
  public async hasRated(request: SessionRequest , response : Response) : Promise<void> {
    const id = request.session.user._id;
    const productId = request.params.id;
    if(id && Types.ObjectId.isValid(id))
    {
      const product : IProduct = await Product.findById(productId);
      for(const rating of product.ratings) {
        if(rating.user.toString() === id){
          response.status(200);
          response.send(true);
          return;
        }
      }
    }
    response.status(200);
    response.send(false);
  }
}


export default RatingController;
