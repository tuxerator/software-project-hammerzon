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
import mongoose, {model, Model, Schema, Types} from 'mongoose';
import {IOrder, IUser, User} from '../models/userSchema';
import {Product} from '../models/Product';

export class MongoDBController {
  constructor() {
    this.initConnection().catch(err => console.log(err));
  }

  async initConnection(): Promise<void> {
    await mongoose.connect('mongodb://localhost:27017/swp');

    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));

    await Product.deleteMany({});


    const product = new Product({
      name:'Zimmerstreichen',
      user:'Streich-ich GmbH',
      prize:10,
      description:'Beschreibung ...',
      duration:new Date(), // 1 Sekunde
      appointments:[{date:new Date(),isReserved:false}]
    });
    product.save();

    await User.deleteMany({});
    const user = new User({
      schema: 1,
      name: 'Max Mustermann',
      email: 'max.muserman@email.com',
      password: 'sicheresPW',
      orders: [{orderTime: new Date().toString()}]
    });
    await user.save();
  }
}
