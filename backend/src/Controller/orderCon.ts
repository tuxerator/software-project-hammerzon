import { Request, Response } from 'express';
import { IOrder, Order } from '../Models/Order';
import { PostOrder, SessionRequest, OrderInfo } from '../types';
import mongoose from 'mongoose';


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
     * registers your order. This method is called when you move from the product page to the order page
     */
    public async registerOrder(request: SessionRequest, response: Response): Promise<void>{
        if(request.session.user)
        {
            response.status(409);
            response.send('Not authorized!');
        }
        else{
            const postedOrder:PostOrder = request.body;
            const newOrder = new Order({
                product : new mongoose.Types.ObjectId(postedOrder.productId),
                orderingUser : new mongoose.Types.ObjectId(request.session.user._id),
                timeOfOrder : new Date(),
                finalized : false,
                timeslot : postedOrder.timeslot
            });
            await newOrder.save();
            const orderInfo : OrderInfo = {
                _id : newOrder._id,
                product : newOrder.product.toString(),
                orderingUser : newOrder.orderingUser.toString(),
                timeOfOrder : newOrder.timeOfOrder,
                finalized : newOrder.finalized,
                timeslot : newOrder.timeslot
            };

            response.status(201);
            response.send({message:'Order registered', orderInfo});
        }  
    }
    /**
     * finalizes your order. this method is called when you click the 'kostenpflichtig Bestellen'
     * button on the order page 
     */
    public async finalizeOrder(request: SessionRequest, response: Response) : Promise<void>
    {
        if(request.session.user)
        {
            response.status(409);
            response.send('Not authorized!');
        }
        else{
            const orderId : string = request.body;
            const finalize = Order.findById( new mongoose.Types.ObjectId(orderId) );
            (await finalize).finalized = true;
            (await finalize).save();
            response.status(201);
            response.send({message:'Order finalized'});
        }  
    }
    
}

export default OrderController;