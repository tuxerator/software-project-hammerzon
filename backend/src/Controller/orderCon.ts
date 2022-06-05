import { Request, response, Response } from 'express';
import { IOrder, Order, Status } from '../Models/Order';
import { PostOrder, SessionRequest, OrderInfo } from '../types';
import mongoose from 'mongoose';
import { IProduct, Product } from '../Models/Product';
import { Types } from 'mongoose';
import session from 'express-session';


class OrderController {
  /**
   * gets every finalized Order from the schema in a list.
   */
  public async listAllOrders(request: SessionRequest, response: Response): Promise<void> {
    if (!request.session.user || !(request.session.user.role === 'admin')) {
      response.status(409);
      response.send('Not authorized');
    }
    else {
      const list: IOrder[] = await Order.
        find({}).
        populate('product').
        populate('orderingUser', '-password').
        populate({
          path: 'product',
          populate: {
            path: 'user',
            model: 'User'
          }
        }).select('-password').
        exec();

      console.log('list of all orders:' + list);
      response.status(200);
      response.send(list);
    }

  }

  /**
   * finds all orders a user has finalized
   */
  public async listAllOrdersByUser(request: SessionRequest, response: Response): Promise<void> {

    const id = request.session.user._id;
    if (id && Types.ObjectId.isValid(id)) {
      const orders: IOrder[] = await Order.find({
        orderingUser: id,
      }).populate('product').populate('orderingUser', '-password').populate({
        path: 'product',
        populate: {
          path: 'user',
          model: 'User'
        }
      }).select('-password').exec();
      console.log(orders);
      response.status(200);
      response.send(orders);
    } else {
      response.status(500);
      response.send('there is no order with such an userid');
    }
  }

  /**
   * list all orders for the products a user added 
   */
  public async listOrdersByCreator(request: SessionRequest, response: Response): Promise<void> {
    const id = request.session.user._id;
    if (id && Types.ObjectId.isValid(id)) {

      let orders = [];
      const products: IProduct[] = await Product.find({ user: id });
      for (const p of products) {
        orders.push(await Order.find({ product: p._id }).populate('product').populate('orderingUser', '-password').exec());
      }
      orders = orders.flat();
      response.status(200);
      response.send(orders);
    } else {
      response.status(500);
      response.send('no orders for this creator');
    }
  }
  /**
   * register an order
   */
  public async registerOrder(request: SessionRequest, response: Response): Promise<void> {
    const postedOrder: PostOrder = request.body;
    const updateProduct = await Product.findById(postedOrder.productId);
    const index = postedOrder.appointmentIndex;

    if (updateProduct.appointments[index].isReserved === true) {
      response.status(409);
      response.send(false);
    }
    else {
      const newOrder = new Order({
        product: new mongoose.Types.ObjectId(postedOrder.productId),
        orderingUser: new mongoose.Types.ObjectId(request.session.user._id),
        timeOfOrder: new Date(),
        appointment: updateProduct.appointments[index],
        status: Status.NNA
      });
      await newOrder.save();
      console.log('saved order:' + newOrder);
      updateProduct.appointments[index].isReserved = true;
      await updateProduct.save();

      updateProduct.appointments[index].isReserved = true;
      await updateProduct.save();

      response.status(201);
      response.send(true);
    }

  }
  
  /**
   * delete an order
   */
  public async deleteOrder(request: SessionRequest, response: Response): Promise<void> {
    const id: string = request.params.id;
    console.log('deleting Order');
    console.log('order id' + id);
    if (id && Types.ObjectId.isValid(id)) {
      const order = await Order.findById(id);
      if (order.orderingUser.toString() === request.session.user._id || request.session.user.role === 'admin') {
        await order.delete();
      }
      console.log('order deleted');
      response.status(200);
    } else {
      response.status(500);
      response.send('there is no order with such an id');
    }
  }

  /**
   * sets the status field of an order.
   */
  public async setStatus(request: SessionRequest, response: Response): Promise<void> {
    const id: string = request.params.id;
    const status: Status = request.body.status as Status;
    const order: IOrder = await Order.findById(id);
    const product: IProduct = await Product.findById(order.product);
    // validating the permissions here because validators don't communicate with the database
    if (product.user.toString() === request.session.user._id || request.session.user.role === 'admin') {

        order.status = status;
        order.save();
        response.status(200);
        response.send({ status });
      
    }
    else {
      response.status(500);
      response.send('confirmation failed');
    }
  }

}

export default OrderController;
