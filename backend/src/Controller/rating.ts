import { IProduct, Product } from '../Models/Product';
import { SessionRequest } from '../types';
import { Types } from 'mongoose';
import { Response } from 'express';
import { IUser } from '../Models/User';
import { IOrder } from '../Models/Order';
import { Order } from '../Models/Order';

class RatingController {
  /**
   * add a rating to a product
   * validate: - rating is between 1 and 5
   *           - user has ordered the product
   * @param request - productid as route parameter
   * {
   *   rating : number
   * }
   * 
   * @param response  -> updated rating and number of Ratings
   */
  public async addRating(request: SessionRequest, response: Response): Promise<void> {
    const id = request.params.id;
    const user = request.session.user._id;
    this.hasOrdered(user, id).then(async (result) => {
      if(result)
      {
        const newRating = request.body.rating;
        if (id && Types.ObjectId.isValid(id)) {
          const product : IProduct = await Product.findById(id);
          console.log(product);
          const numberOfRatings = product.numberOfRatings;
          const rating = product.rating;
          product.rating = ((rating * numberOfRatings)+newRating)/(numberOfRatings+1);
          product.numberOfRatings++;
          product.save();
          console.log(product.rating);
          response.status(200);
          response.send({rating : product.rating, numberOfRatings : product.numberOfRatings});
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
   * add a comment to a product
   * validate: - length of the comment string
   *           - user has ordered the product
   * @param request - productid as route parameter
   * {
   *    comment : string
   * }
   * @param response -> success message
   */
  public async addComment(request: SessionRequest, response : Response) : Promise<void>
  {
    const id = request.params.id;
    const user = request.session.user._id;
    this.hasOrdered(user, id).then(async (result) => {
      if(result)
      {
        const comment = request.body.rating;
        if (id && Types.ObjectId.isValid(id)) {
          const product : IProduct = await Product.findById(id);
          console.log(product);
          product.comments.push(comment);
          product.save();
          console.log(product.comments);
          response.status(200);
          response.send({ code : 200 , message : 'Comment added successfully'});
        }
        else
        {
          response.status(500);
          response.send('There is no product with such an id');
        }
      }
      else {
        response.status(500);
        response.send('this user did not order the product');
      }
    });
    const comment = request.body.rating;
    if (id && Types.ObjectId.isValid(id)) {
      const product : IProduct = await Product.findById(id);
      console.log(product);
      product.comments.push(comment);
      product.save();
      console.log(product.comments);
      response.status(200);
      response.send({ code : 200 , message : 'Comment added successfully'});
    }
    else
    {
      response.status(500);
      response.send('There is no product with such an id');
    }
  }

  /**
   * checks if the user has ordered the product
   * @param user        - current user from the session request
   * @param productID   - id of the product
   * @returns           
   */
  public async hasOrdered(user : IUser, productID : string) : Promise<boolean> {
    const id = user._id;
    if(id && Types.ObjectId.isValid(id))
    {
      const orders : IOrder[] = await Order.find({oderingUser : id});
      orders.forEach(element => {
        if(element._id === productID)
        {
          return Promise.resolve(true);
        }
      });
    }
    return Promise.resolve(false);
  }

}

export default RatingController;