import { Request, Response } from 'express';
import Helper from '../helpers';
import {IProduct, Product} from '../Models/Product';
import { ListInfo, SessionRequest } from '../types';
import {Types} from 'mongoose';
class ProductController
{
    // Gibt die ProductInfos die zwischen start und start+limit liegen
    // und eine zusätzliche Informationen requestable, also wie viele elemente es noch bis zum ende in der Liste gibt, zurück
    // z.b für die Liste [0,1,2,3] ließ er sich mit start = 1 und limit = 2
    //     die Liste [1,2] geben und requestable wäre 1 also {list:[1,2] requestable:1} (vom Type ListInfo<number>)
    public async getList(request: Request, response: Response): Promise<void> {
        const productCount = await Product.countDocuments().exec();
        // Parse Limit und Start von Query
        //                                                      min,      max,   replace
        const start = Helper.parseQueryInt(request.query,'start',0,productCount,0);
        // Falls start sehr nah am Ende ist gilt this.list.length - start sonst einfach nur 10
        const maxLimit = Math.max(productCount - start, 10);

        const limit = Helper.parseQueryInt(request.query,'limit',0,maxLimit,10);

        // Falls es einen Search Term gibt nutzt diesen Anstelle von
        const searchTerm = request.query.search;
        let list : IProduct[];

        let requestable;
        if(searchTerm)
        {
            // Wenn es nur eine Zahl gibt dann ntze es für preis
            let testPrize = parseFloat(searchTerm as string);
            if(!testPrize)
            {
                testPrize = 0;
            }

            console.log(searchTerm);
            const query = {$or:[
                // und sonst überprufen durch regex den namen des Products
                {name:{$regex:searchTerm}},
                {prize:{$lte:testPrize}}
              ]};
            list = await Product.find(query).skip(start).exec();
            // Wie viele Elemente kommen danach noch 
            requestable =  Math.max(list.length - limit - start,0);
        }
        else{
            // Sonst gebe einfach alle bis zu nem bestimmten limit hinzu
            list = await Product.find({}).skip(start).exec();
            // Wieviele Elemente kommen danach noch
            requestable = Math.max(productCount - limit - start,0);
        }

        const listInfo : ListInfo<IProduct> = {
            list:list.splice(0,limit),//this.list.slice(start,start + limit),
            requestable
        };

        response.status(200);
        response.send(listInfo);
    }

    public async getProductDetail(request: Request, response: Response): Promise<void>{

        const id = request.params.id;
        console.log(id);
        if(id && Types.ObjectId.isValid(id))
        {
            const product : IProduct = await Product.findById(id).exec();
            console.log('Searching');
            console.log(product);
            response.status(200);
            response.send(product);
        }else {
            console.log('error');
            response.status(500);
            response.send('There is no product with such an id');
        }
    }


    public async addProduct(request:SessionRequest,response:Response):Promise<void>
    {
        if(!request.session.user)
        {
            response.status(403);
            response.send('Not Authorized');
            return;
        }

        const product = request.body; //
        console.log(product);
        // Wenn ein Wert nicht existiert dann Antworte mit eine Fehler meldung
        if(!Helper.valueExists(product,'name',response)) return;
        if(!Helper.valueExists(product,'description',response)) return;
        if(!Helper.valueExists(product,'prize',response)) return;
        if(!Helper.valueExists(product,'duration',response)) return;
        if(!Helper.valueExists(product,'appointments',response)) return;

        product.user = request.session.user._id;

        if(product.name.length <= 3)
        {
            response.status(403);
            response.send({code:403,message:'Name needs to be at least 4 Chars'});
            return;
        }

        const dbProduct = new Product(product);

        dbProduct.user = request.session.user._id;

        await dbProduct.save();

        response.status(200);
        response.send({code:200,message:'Added Product'});
    }


}


export default ProductController;

