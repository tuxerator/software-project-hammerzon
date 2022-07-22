import { Request, Response } from 'express';
import Helper from '../Utils/helpers';
import { IAvailability, IProduct, Product } from '../Models/Product';
import { ListInfo, SessionRequest } from '../types';
import { Types } from 'mongoose';
import { Order } from '../Models/Order';
import { Category } from '../Models/Category';
import { ActivityController } from './activity';
import { green, lightBlue, red, } from '../Models/Activity';


export class ProductController {
  // Gibt die ProductInfos die zwischen start und start+limit liegen
  // und eine zusätzliche Informationen requestable, also wie viele elemente es noch bis zum ende in der Liste gibt, zurück
  // z.b für die Liste [0,1,2,3] ließ er sich mit start = 1 und limit = 2
  //     die Liste [1,2] geben und requestable wäre 1 also {list:[1,2] requestable:1} (vom Type ListInfo<number>)
  public async getList(request: SessionRequest, response: Response): Promise<void> {
    const productCount = await Product.countDocuments().exec();


    // Parse Limit und Start von Query
    //                                                      min,      max,   replace
    const start = Helper.parseQueryInt(request.query, 'start', 0, productCount, 0);
    // Falls start sehr nah am Ende ist gilt this.list.length - start sonst einfach nur 10
        const maxLimit = Math.max(productCount - start, 10);

    const limit = Helper.parseQueryInt(request.query, 'limit', 0, maxLimit, 10);

        // Falls es einen Search Term gibt nutzt diesen Anstelle von
    const searchTerm:string = request.query.search as string;

      const categoryName:string = request.query.category as string;

      let categoryId: undefined|Types.ObjectId = undefined;
      if(categoryName)
      {
         categoryId = (await Category.find({name:categoryName}).exec())[0]?._id;
      }
      let query:any = {};
      // wenn es eine passende Category gibt
      if(categoryId)
      {
        // dann suche nur in dieser
        query.category = {_id:categoryId};
      }

      // Wenn es einen Suchebegriff gibt
      let searchgramString : string ;
      if(searchTerm)
      {
            // Wenn es nur eine Zahl gibt dann ntze es für preis
        /*let testPrize = parseFloat(searchTerm);
        if(!testPrize)
        {
            testPrize = 0;
        }*/
        console.log(searchTerm);
        // dann suche mithilfe diesem in Description und Name nach passenden elementen

        ActivityController.addActivity(request.session.user,[green(' sucht '),' nach dem Begriff ', lightBlue(searchTerm)]);

        const searchgrams : string[] = Helper.ngram(searchTerm, 3);

        searchgramString = searchgrams.join(' ');

        // dann suche mithilfe diesem in Description und Name nach passenden elementen
        /*
        query.$text = {
                        $search:searchgramString,
                      };
        */

        query = {
          $text : { $search : searchgramString},
          score : { $meta : 'textScore'}
        };

      }
    console.log('query:');
    console.log(query);
    // Sonst gebe einfach alle bis zu nem bestimmten limit hinzu
    let list;
    if(query.score)
    {
      /*
      list = await Product.find(query)
        .where('score.$meta.textScore')
        .gt(500000000000000000000000000000)
        .sort({score : {$meta : 'textScore'}})
        .skip(start)
        .select('-ngrams -prefixNgrams')
        .populate('user', '-password -address')
        .populate('category')
        .exec();
      */
      list = await Product.aggregate(
        [
        { $match: { $text : { $search : searchgramString}}},
        { $project: {_id:1 , name : 1, user : 1, description:1, prize:1,duration:1,category:1,image_id:1,numberOfRatings:1,averageRating:1, score : { $meta : 'textScore'}} },
        { $match: { score : { $gt: 1 }}}
        ]
      )
      .sort({score : {$meta : 'textScore'}})
      .skip(start);

      await Product.populate(list, {path: 'user'});
      await Product.populate(list, {path: 'category'});
    }
    else
    {
      list = await Product.find(query)
        .skip(start)
        .select('-ngrams -prefixNgrams')
        .populate('user', '-password -address')
        .populate('category')
        .exec();
    }

    // Wieviele Elemente kommen danach noch
    const requestable =  Math.max(list.length - limit - start,0);

      // Just take first 'limit' elements from list
    list = list.splice(0, limit);


    const listInfo: ListInfo<IProduct> = {
      list,//this.list.slice(start,start + limit),
      requestable
    };

        response.status(200);
        response.send(listInfo);
    }

    // Gibt die Produkt details zurück
  public async getProductDetail(request: SessionRequest, response: Response): Promise<void> {
    console.log(request.session);
    const id = request.params.id;
    console.log(id);
    if (id && Types.ObjectId.isValid(id)) {
      const product: IProduct = await Product.findById(id).select('-ngrams')
      .populate('user', '-password -address')
      .populate('category')
      .populate({
        path: 'ratings',
        populate: {
          path: 'user',
          model: 'User'
        }
      })
      .exec();
      console.log(request.session.user);
      ActivityController.addActivity(request.session.user,[green('schaut'),' sich die ', green('Dienstleistung'), lightBlue(product?.name), 'an']);
      response.status(200);
      response.send(product);
    } else {
      console.log(request.session.user);
      ActivityController.addActivity(request.session.user,[' verschucht die nicht vorhandene ', red('Dienstleistung'), lightBlue(id), red(' anzuchauen')]);
      response.status(500);
      response.send('there is no product with such an id');
    }
  }

  /**
  * return similar product of a given product
  * @param request {product:string}
  * @param response {list:Product[3], requestable:0}
  * @returns
  */
  public async getSimilarProduct(request:Request, response: Response):Promise<void>{


    const id = request.params.id;

    if (!id || !Types.ObjectId.isValid(id)) {

      response.status(500);
      response.send('There is no product with such an id');
      return;

    }
    // Get Product to search from
    const product = await Product.findById(id);

    if (!product) {
      response.status(400);
      response.send({code: 400, message: 'Product not found'});
      return;
    }

    // Find Products some what similar to this product
    let products = await Product.find({$text: {$search: `${product.name} ${product.description}`},_id:{$ne:product._id}}, {score: {$meta: 'textScore'}}).sort({score: {$meta: 'textScore'}}).limit(3).populate('user', '-password -address').populate('category').exec();
    const productIDs = [product._id,...products.map(p => p._id)];
                    // 1                            0
    const querys = [{_id:{$ne:productIDs}},{_id:{$ne:productIDs},category:{_id:product.category._id}}];
    let query;
    // If there are less then 3 products similar to this product
    // at first find product in the same category
    // and after that just find any product
    while(products.length < 3 && (query = querys.pop()))
    {
      const additionalProducts = await Product.find(query).limit(3 - products.length).populate('user', '-password -address').populate('category').exec();
      console.log(products);
      console.log(query);
      products = products.concat(additionalProducts);

    }

    const listInfo: ListInfo<IProduct> = {
      list:products,//this.list.slice(start,start + limit),
      requestable:0
    };


    response.status(200);
    response.send(listInfo);

  }

  /**
   * adds product to ProductDb
   * @param request {body:Product}
   * @param response {code:number, message:string}
   */
  public async addProduct(request: SessionRequest, response: Response): Promise<void> {
    let product =   {...request.body,
      numberOfRatings : 0,
      averageRating : 1,
      ratings : []
    };
    console.log('POST:\nproduct: %o', product);

    // add ngrams
    const namegrams : string = Helper.ngram(product.name, 3).join(' ');

    // add prefix ngrams
    const prefixNgrams : string = Helper.prefixNgram(product.name, 3).join(' ');

    product = {... product,
      ngrams : namegrams,
      prefixNgrams : prefixNgrams
    };


    // set owner to logged-in user
    product.user = request.session.user._id;

    delete product._id;

    const dbProduct = new Product(product);
    // save it in db
    await dbProduct.save();
    // send success state
    response.status(200);
    response.send({ code: 200, message: 'Add Successfull', id: dbProduct._id });
    }
    /**
     * Removes Product form DB and removes its relating orders
     * @param request
     * @param response
     * @returns
     */
    public async removeProduct(request:SessionRequest,response:Response):Promise<void>
    {
        const id = request.params.id;
        // Find product in
        const product = await Product.findById(id);

        if(!product)
        {
            response.status(400);
            response.send({code:400,message:'Product does not exist'});
            return;
        }
        console.log(product);
        console.log(request.session.user);
        console.log(product.user === request.session.user._id);
        // Test wether current loggedin-user eguals to product-owner or current user is a admin
        if(!(product.user.equals(new Types.ObjectId(request.session.user._id)) || request.session.user.role === 'admin'))
        {
            console.log(product.user);
            console.log(new Types.ObjectId(request.session.user._id));
            response.status(403);
            response.send({code:403,message:'Not Authorized'});
            return;
        }
        // Delete related rrders
        await Order.deleteMany({product: product._id});
        // Delete Prduct
        await product.delete();
        response.status(200);
        response.send({code:200,message:'Product deleted'});
    }

    public async addAvailability(req: Request, res: Response): Promise<void> {
        const availability: IAvailability = req.body;
        const product: IProduct = await Product.findById(new Types.ObjectId(req.params.id)).exec();

        product.availability.push(availability);
        await product.save();

        res.status(200);
        res.send({ code: 200, message: 'Add Successfull', id: product._id });
    }

    public async addHindrance(req: Request, res: Response): Promise<void> {
      const product: IProduct = await Product.findById(new Types.ObjectId(req.params.id)).exec();

      // Get Availabi

      await product.save();

      res.status(200);
      res.send({ code: 200, message: 'Add Successfull', id: product._id });
    }

  /**
   * Sends a list of all availabitlitys of a product
   * @param req
   * @param res
   */
  public async getAvailabilityList(req: Request, res: Response): Promise<void> {
    console.log('GET:\nproduct availabilities from product: %o', req.params.id);
    const product: IProduct = await Product.findById(new Types.ObjectId(req.params.id)).exec();
    if (!product) {
      res.status(400);
      res.send({ code: 400, message: 'Product does not exist' });
      return;
    }
    console.log('availabilities: %o', product.availability);
    res.status(200);
    res.send(product.availability);
  }
}

export const product = new ProductController();


