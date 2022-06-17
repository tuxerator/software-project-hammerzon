import { IProduct, Product } from '../Models/Product';
import { SessionRequest } from '../types';
import { Types } from 'mongoose';
import { Response } from 'express';

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


}

export default RatingController;