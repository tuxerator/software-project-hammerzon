import { Request, Response } from 'express';
import Helper from '../helpers';
import {IProduct, Product} from '../Models/Product';
import { IOrder, Order } from '../Models/Order';
import { ListInfo } from '../types';

class OrderController{
    /**
     * gets every Order from the schema in a list.
     */
    public async listAllOrders(request: Request, response: Response): Promise<void>{
        const list : IOrder[] = await Order.find({});

        response.status(200);
        response.send(list);
    }

    /**
     * gets Orders belonging to a user
     
    public async getOrder(request: Request, response: Response): Promise<void>{
        const list : IOrder[] = await Order.find({ })
    }
    */

}

export default OrderController;
