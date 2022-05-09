/**
 * This file contains the controller which handels the connection to MongoDB via mongoose.
 * If everything is working correctly you should get the console output: 'Database is working correctly!'.
 *
 * To inspect the database you can use {@link https://www.mongodb.com/docs/mongodb-shell/ mongosh}.
 *
 * Documentation:
 *
 * {@link https://www.mongodb.com/docs/manual/tutorial/getting-started/ MongoDB}
 * {@link https://mongoosejs.com/docs/index.html mongoose}
 */
import mongoose, { Schema, Types } from 'mongoose';
import { IOrder, User } from '../models/userSchema';
import { Service } from '../models/serviceModel';


export class MongoDBController {

  constructor() {
    this.initConnection().catch(err => console.log(err));
  }

  async initConnection(): Promise<void> {
    await mongoose.connect('mongodb://localhost:27017/swp'); // Connect to MongoDB
    console.log(mongoose.connection.readyState); // Prints 1 if connected successfully

    const user2 = new User({
      name: 'Maxi Mustermann',
      email: 'maxi.musermann@test.de',
      password: 'muster'
    });

    const service = new Service({
      offeredBy: user2._id,
      name: 'Test Service',
      timeSlots: [{
        date: new Date(),
        slot: 5,
        booked: false
      }]
    });

    const user = new User({
      name: 'Max Mustermann',
      email: 'max.musermann@test.de',
      password: 'musterPW',
      orders: [{
        service_id: service._id._id,
        orderTime: new Date()
      }, {
        service_id: service._id._id,
        orderTime: new Date()
      }]
    });

    const order: IOrder = {
      service_id: service._id,
      orderTime: new Date()
    }
    //user.orders.push(order);
    await user.save();
  }
}
