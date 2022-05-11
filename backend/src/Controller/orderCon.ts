import { Request, Response } from 'express';
import { IOrder, Order } from '../Models/Order';


class OrderController{
    /**
     * gets every Order from the schema in a list.
     */
    public async listAllOrders(request: Request, response: Response): Promise<void>{
        const list : IOrder[] = await Order.find({});

        response.status(200);
        response.send(list);
    }
    
}

export default OrderController;
