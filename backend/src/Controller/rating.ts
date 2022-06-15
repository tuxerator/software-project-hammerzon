import { IProduct, Product } from '../Models/Product';
import { SessionRequest } from '../types';
import { Types } from 'mongoose';
import { Response } from 'express';

class RatingController {
  /**
   * validate: - rating is between 1 and 5
   *           - user has ordered the product
   * @param request - productid as route parameter
   * {
   *   rating : number
   * }
   * 
   * @param response  -> updated rating
   */
  public async addRating(request: SessionRequest, response: Response): Promise<void> {
    const id = request.params.id;
    const newRating = request.body.rating;
    if (id && Types.ObjectId.isValid(id)) {
      const product : IProduct = await Product.findById(id);
      console.log(product);
      if(product.numberOfRatings === null)
      {
        product.numberOfRatings = 0;
        product.rating = 1;
      }
      else 
      {
        const numberOfRatings = product.numberOfRatings;
        const rating = product.rating;
        product.rating = ((rating * numberOfRatings)+newRating)/(numberOfRatings+1);
        product.numberOfRatings++;
        product.save();
        console.log(product.rating);
        response.status(200);
        response.send({rating : product.rating, numberOfRatings : product.numberOfRatings});
      }
    }
    else {
    response.status(500);
    response.send('there is no order with such an id');
  }
  }



}

export default RatingController;