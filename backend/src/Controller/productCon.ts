import { Request, Response } from 'express';
import Helper from '../helpers';
import {IProduct, Product} from '../Models/Product';
import { ListInfo, PostOrder } from '../types';
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

    public async getProductDetail(request: Request, response: Response): Promise<void>{

        const id = request.params.id;
        console.log(id);
        if(id && Types.ObjectId.isValid(id))
        {
            const product : IProduct = await Product.findById(id).exec();
            response.status(200);
            response.send(product);
        }else {
            response.status(500);
            response.send('there is no product with such an id');
        }
    }
    public async resetAppointment(request: Request, response: Response): Promise<void>{
        console.log('resetting');
        const product : PostOrder = request.body;
        const index = parseInt(String(product.appointmentIndex));
        const id = product.productId;
        if(id && Types.ObjectId.isValid(id))
        {
            const updateProduct = await Product.findById(id);
            (await updateProduct).appointments[index].isReserved = false;
            (await updateProduct).save();
            console.log('appointment reset');
            response.status(200);
        }
        else
        {
            response.status(500);
            response.send('there is no product with such an id');
        }
    }

}


export default ProductController;

