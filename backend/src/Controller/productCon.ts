import { Request, Response } from 'express';
import Helper from '../helpers';
import { IAvailability, IProduct, Product } from '../Models/Product';
import { ListInfo, SessionRequest, PostOrder } from '../types';
import { Model, Types } from 'mongoose';

class ProductController {
    // Gibt die ProductInfos die zwischen start und start+limit liegen
    // und eine zusätzliche Informationen requestable, also wie viele elemente es noch bis zum ende in der Liste gibt, zurück
    // z.b für die Liste [0,1,2,3] ließ er sich mit start = 1 und limit = 2
    //     die Liste [1,2] geben und requestable wäre 1 also {list:[1,2] requestable:1} (vom Type ListInfo<number>)
    public async getList(request: Request, response: Response): Promise<void> {
        const productCount = await Product.countDocuments().exec();
        // Parse Limit und Start von Query
        //                                                      min,      max,   replace
        const start = Helper.parseQueryInt(request.query, 'start', 0, productCount, 0);
        // Falls start sehr nah am Ende ist gilt this.list.length - start sonst einfach nur 10
        const maxLimit = Math.max(productCount - start, 10);

        const limit = Helper.parseQueryInt(request.query, 'limit', 0, maxLimit, 10);

        // Falls es einen Search Term gibt nutzt diesen Anstelle von
        const searchTerm = request.query.search;
        let list: IProduct[];

        let requestable;
        if (searchTerm) {
            // Wenn es nur eine Zahl gibt dann ntze es für preis
            let testPrize = parseFloat(searchTerm as string);
            if (!testPrize) {
                testPrize = 0;
            }

            console.log(searchTerm);
            const query = {
                $or: [
                    // und sonst überprufen durch regex den namen des Products
                    { name: { $regex: searchTerm } },
                    { prize: { $lte: testPrize } }
                ]
            };
            list = await Product.find(query).skip(start).populate('user').exec();
            // Wie viele Elemente kommen danach noch
            requestable = Math.max(list.length - limit - start, 0);
        } else {
            // Sonst gebe einfach alle bis zu nem bestimmten limit hinzu
            list = await Product.find({}).skip(start).populate('user').exec();
            // Wieviele Elemente kommen danach noch
            requestable = Math.max(productCount - limit - start, 0);
        }
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
    public async getProductDetail(request: Request, response: Response): Promise<void> {

        const id = request.params.id;
        console.log(id);
        if (id && Types.ObjectId.isValid(id)) {
            const product: IProduct = await Product.findById(id).populate('user', '-password -address').exec();
            response.status(200);
            response.send(product);
        } else {
            response.status(500);
            response.send('there is no product with such an id');
        }
    }

    public async addProduct(request: SessionRequest, response: Response): Promise<void> {
        const product = request.body;
        console.log(product);

        // Setze es auf den Angemeldeten User
        product.user = request.session.user._id;

        delete product._id;

        const dbProduct = new Product(product);

        await dbProduct.save();

        response.status(200);
        response.send({ code: 200, message: 'Add Successfull', id: dbProduct._id });
    }

    public async removeProduct(request:SessionRequest,response:Response):Promise<void>
    {
        const id = request.body.id;
        //
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
        if(!(product.user === request.session.user._id || request.session.user.role === 'admin'))
        {
            response.status(403);
            response.send({code:403,message:'Not Authorized'});
            return;
        }

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
        res.send({ code: 200, message: `Add Successfull`, id: product._id })
    }

    public async addHindrance(req: Request, res: Response): Promise<void> {
        const hindrance: IAvailability = req.body;
        const product: IProduct = await Product.findById(new Types.ObjectId(req.params.id)).exec();

        // Get Availabi

        await product.save();

        res.status(200);
        res.send({ code: 200, message: `Add Successfull`, id: product._id })
    }
}


export default ProductController;

