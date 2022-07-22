import { Response } from 'express';
import { IOrder, Order, Status } from '../Models/Order';
import { PostOrder, SessionRequest } from '../types';
import mongoose from 'mongoose';
import { IAvailability, IProduct, Product } from '../Models/Product';
import { IUser } from '../Models/User';
import { Types } from 'mongoose';
import { SocketServer } from './socketServer';


export class OrderController {
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
     * Validates a order for correctness
     */
    public async validateOrder(request: SessionRequest, response: Response): Promise<void>{
        response.status(200);
        response.send({ code: 200, message: 'Order is valid' });
    }

  public async getAppointProductPair(postOrder: PostOrder): Promise<{ product: IProduct, appointment: IAvailability } | undefined> {
    const postedOrder: PostOrder = postOrder;
    const updateProduct = await Product.findById(postedOrder.productId);

    return { product: updateProduct, appointment: postedOrder.appointment };
  }

  /**
   * register an order
   */
  public async registerOrder(pap: { product: IProduct, appointment: IAvailability }, user: IUser): Promise<IOrder> {

    console.log(pap);
    const newOrder = new Order({
      product: new mongoose.Types.ObjectId(pap.product._id),
      orderingUser: new mongoose.Types.ObjectId(user._id),
      timeOfOrder: new Date(),
      appointment: pap.appointment,
      status: Status.NNA
    });

    await newOrder.save();
    console.log('saved order:' + newOrder);
    const product =  (await Product.findById(pap.product._id).populate<{user:IUser}>('user').exec());
    SocketServer.socket.onAppointmnetAdded(product.user,newOrder.appointment);

    //SocketServer.socket.removeAppointmentWithoutSending(product.user,order.appointment);

    await pap.product.save();
    return newOrder;
  }

  /**
   * Add a new order to the database
   */
  public async addOrder(request: SessionRequest, response: Response): Promise<void> {
    const order: PostOrder = request.body;
    const orderingUserId = request.session.user._id;

    const dbOrder = new Order({
      product: order.productId,
      orderingUser: orderingUserId,
      appointment: order.appointment,
      confirmed: false
    });
    await dbOrder.save();

    const product  = await Product.findById(order.productId).populate<{ user: IUser }>('user').exec();
    SocketServer.socket.removeAppointmentWithoutNotify(product.user,order.appointment);

    response.status(200);
    response.send({ code: 200, message: 'Add Successfull', id: dbOrder._id, orderRegistered: true });
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
            response.send();
        }
        else
        {
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
    if ( product.user.toString() === request.session.user._id || request.session.user.role === 'admin') {

      order.status = status;
      order.save();
      response.status(200);
      response.send({ status });

    } else {
      response.status(500);
      response.send('confirmation failed');
    }
  }

/*
  public async registerAppointment(request: SessionRequest, response: Response): Promise<void> {
    const order: PostOrder = request.body;
    const product = await Product.findById(order.productId).populate<{ user: IUser }>('user').exec();

    AppointmentSocket.socket.onAppointmnetAdded(product.user, order.appointment);
    response.status(200);
    response.send({ message: 'appointment registered', code: 200 });
  }

  public async unregisterAppointment(request: SessionRequest, response: Response): Promise<void> {
    const order: PostOrder = request.body;
    const product = await Product.findById(order.productId).populate<{ user: IUser }>('user').exec();

    AppointmentSocket.socket.onAppointmnetRemoved(product.user, order.appointment);
    response.status(200);
    response.send({ message: 'appointment unregistered', code: 200 });
  }
*/

}

export const order = new OrderController();
