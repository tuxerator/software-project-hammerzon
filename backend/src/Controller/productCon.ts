import { Request, Response } from 'express';
import Helper from '../helpers';
import {IProduct, Product} from '../Models/Product';
import { ListInfo } from '../types';


class ProductController
{
    public async getList(request: Request, response: Response): Promise<void> {
        const productCount = await Product.countDocuments().exec();
        // Parse Limit und Start von Query
        //                                                      min,      max,   replace
        const start = Helper.parseQueryInt(request.query,'start',0,productCount,0);
        // Falls start sehr nah am Ende ist gilt this.list.length - start sonst einfach nur 10
        const maxLimit = Math.min(productCount - start, 10);

        const limit = Helper.parseQueryInt(request.query,'limit',0,maxLimit,10);
        const requestable = Math.max(productCount - limit - start,0);

        const list : IProduct[] = await Product.find({}).skip(start).limit(limit).exec();

        const listInfo : ListInfo<IProduct> = {
            list,//this.list.slice(start,start + limit),
            requestable
        };

        response.status(200);
        response.send(listInfo);
    }



}


export default ProductController;

