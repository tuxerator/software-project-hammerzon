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
     * Validates a order for correctness
     */
    public async validateOrder(request: SessionRequest, response: Response): Promise<void>{
        response.status(200);
        response.send({ code: 200, message: 'Order is valid' });
    }

    /**
     * Add a new order to the database
     */
    public async addOrder(request: SessionRequest, response: Response): Promise<void>{
        const order: PostOrder = request.body;
        const orderingUserId = request.session.user._id;
        if(orderingUserId && Types.ObjectId.isValid(orderingUserId))
        {
            const dbOrder = new Order({
                product : order.productId,
                orderingUser : orderingUserId,
                appointment : order.appointment,
                confirmed: false
            });
            await dbOrder.save();
            response.status(200);
            response.send({ code: 200, message: 'Add Successfull', id: dbOrder._id });
        }
        else
        {
            response.status(500);
            response.send({ code: 500, message: 'UserID does not exist' });
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
