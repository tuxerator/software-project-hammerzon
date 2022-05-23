import { Request, Response } from 'express';
import { IOrder, Order } from '../Models/Order';
import { PostOrder, SessionRequest, OrderInfo } from '../types';
import mongoose from 'mongoose';
import { Product } from '../Models/Product';
import {Types} from 'mongoose';
import session from 'express-session';

class OrderController{
    /**
     * gets every finalized Order from the schema in a list.
     */
    public async listAllOrders(request: SessionRequest, response: Response): Promise<void>{
        if( !request.session.user || !(request.session.user.role === 'admin'))
        {
            response.status(409);
            response.send('Not authorized');
        }
        else
        {
            const list : IOrder[] = await Order.
                                                find({finalized : true}).
                                                populate('product').
                                                populate('orderingUser','-password').
                                                exec();
            response.status(200);
            response.send(list);
        }

    }
    /**
     * finds all orders a user has finalized
     */
    public async listAllOrdersByUser(request: SessionRequest, response: Response): Promise<void>{

        const id = request.session.user._id;
        if(id && Types.ObjectId.isValid(id))
        {
            const orders : IOrder[] = await Order.
                                                find({orderingUser : id, finalized : true}).
                                                populate('product').
                                                populate('orderingUser','-password').
                                                exec();
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
    /**
     * registers your order. This method is called when you move from the product page to the order page
     */
    public async registerOrder(request: SessionRequest, response: Response): Promise<void>{

        const postedOrder:PostOrder = request.body;
        const updateProduct = await Product.findById(postedOrder.productId);
        const index = parseInt(String(postedOrder.appointmentIndex));

        if(updateProduct.appointments[index].isReserved === true)
        {
            response.status(409);
            response.send(false);
        }
        else
        {
            const newOrder = new Order({
                product : new mongoose.Types.ObjectId(postedOrder.productId),
                orderingUser : new mongoose.Types.ObjectId(request.session.user._id),
                timeOfOrder : new Date(),
                appointment : updateProduct.appointments[index],
                confirmed : false
            });
            await newOrder.save();

            updateProduct.appointments[index].isReserved = true;
            await updateProduct.save();

            response.status(201);
            response.send(true);
        }

    }

    public async deleteOrder(request: SessionRequest, response: Response) : Promise<void>
    {
        const id:string = request.params.id;
        console.log('deleting Order');
        console.log('order id' + id);
        if(id && Types.ObjectId.isValid(id))
        {
            const order = await Order.findById(id);
            if(order.orderingUser === request.session.user._id || request.session.user.role === 'admin')
            {
                await order.delete();
            }

            console.log('order deleted');
            response.status(200);
        }
        else
        {
            response.status(500);
            response.send('there is no order with such an id');
        }
    }

}

export default OrderController;
