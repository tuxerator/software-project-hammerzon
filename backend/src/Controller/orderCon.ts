import { Request, Response } from 'express';
import { IOrder, Order } from '../Models/Order';
import { PostOrder, SessionRequest, OrderInfo } from '../types';
import mongoose from 'mongoose';
import { Product } from '../Models/Product';
import {Types} from 'mongoose';

class OrderController{
    /**
     * gets every finalized Order from the schema in a list.
     */
    public async listAllOrders(request: Request, response: Response): Promise<void>{
        const list : IOrder[] = await Order.find({finalized : true});

        response.status(200);
        response.send(list);
    }
    /**
     * finds all orders a user has finalized
     */
    public async listAllOrdersByUser(request: SessionRequest, response: Response): Promise<void>{
        if(!request.session.user)
        {
            response.status(409);
            response.send('Not authorized');
        }
        else
        {
            const id = request.session.user._id;
            if(id && Types.ObjectId.isValid(id))
            {
                const orders : IOrder[] = await Order.find({orderingUser : id, finalized : true});
                console.log('orders found');
                console.log(orders);
                response.status(200);
                response.send(orders);
            }
            else
            {
                response.status(500);
                response.send('there is no order with such an userid');
            }
        }
    }
    /**
     * registers your order. This method is called when you move from the product page to the order page
     */
    public async registerOrder(request: SessionRequest, response: Response): Promise<void>{
        if(!request.session.user)
        {
            response.status(409);
            response.send('Not authorized!');
        }
        else{
            const postedOrder:PostOrder = request.body;
            const updateProduct = await Product.findById(postedOrder.productId);
            const index = parseInt(String(postedOrder.appointmentIndex));
            const newOrder = new Order({
                product : new mongoose.Types.ObjectId(postedOrder.productId),
                orderingUser : new mongoose.Types.ObjectId(request.session.user._id),
                timeOfOrder : new Date(),
                finalized : false,
                appointment : (await updateProduct).appointments[index],
                confirmed : false
            });
            await newOrder.save();
            const orderInfo : OrderInfo = {
                _id : newOrder._id.toString(),
                product : newOrder.product.toString(),
                orderingUser : newOrder.orderingUser.toString(),
                timeOfOrder : newOrder.timeOfOrder,
                finalized : newOrder.finalized,
                appointment : newOrder.appointment,
                confirmed : newOrder.confirmed
            };
            (await updateProduct).appointments[index].isReserved = true;
            (await updateProduct).save();
            response.status(201);
            response.send(orderInfo);
        }  
    }
    public async deleteOrder(request: Request, response: Response) : Promise<void>
    {
        const id:string = request.params.id;
        console.log('deleting Order');
        console.log('order id' + id);
        if(id && Types.ObjectId.isValid(id))
        {
            await Order.findByIdAndRemove(id);
            console.log('order deleted');
            response.status(200);
        }
        else
        {
            response.status(500);
            response.send('there is no order with such an id');
        }
    }
    /**
     * finalizes your order. this method is called when you click the 'kostenpflichtig Bestellen'
     * button on the order page 
     */
    public async finalizeOrder(request: SessionRequest, response: Response) : Promise<void>
    {
        if(!request.session.user)
        {
            response.status(409);
            response.send('Not authorized!');
        }
        else{
            const orderId : string = request.params.id;
            const finalize = await Order.findById( new mongoose.Types.ObjectId(orderId) );
            (await finalize).finalized = true;
            (await finalize).save();
            response.status(201);
            response.send(finalize);
        }  
    }
    
}

export default OrderController;
