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
import {IOrder, IUser, User} from '../models/user';
import {Product} from '../models/Product';
import { IService, Service } from '../models/service';
import ProductTestData from '../productTestData';
import OrderTestData from '../orderTestData';
import UserTestData from '../userTestData';


export class MongoDBController {

  constructor() {
    this.initConnection().catch(err => console.log(err));
  }

  async initConnection(): Promise<void> {
    await mongoose.connect('mongodb://localhost:27017/swp'); // Connect to MongoDB
    console.log(`Database is ${(mongoose.connection.readyState === 1) ?'ready' : 'errored' }`); // Prints 1 if connected successfully
    new ProductTestData();
    new OrderTestData();
    new UserTestData();

    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));

    this.createTestData().catch(err => console.log(err));
  }

  private userTestData= [
    new User({
      schema_V: 1,
      name: 'Max Mustermann',
      email: 'max.mustermann@email.com',
      password: 'musterPW',
      address: {
        street: 'Muserstraße',
        houseNumber: 44,
        postCode: '89123',
        city: 'Musterstadt',
        country: 'Germany'
      },
      orders: []
    }),
    new User({
      schema_V: 1,
      name: 'Max Mustermann',
      email: 'max.mustermann@email.com',
      password: 'musterPW',
      address: {
        street: 'Muserstraße',
        houseNumber: 44,
        postCode: '89123',
        city: 'Musterstadt',
        country: 'Germany'
      },
      orders: []
    }),
    new User({
      schema_V: 1,
      name: 'Max Mustermann',
      email: 'max.mustermann@email.com',
      password: 'musterPW',
      address: {
        street: 'Muserstraße',
        houseNumber: 44,
        postCode: '89123',
        city: 'Musterstadt',
        country: 'Germany'
      },
      orders: []
    }),
    new User({
      schema_V: 1,
      name: 'Max Mustermann',
      email: 'max.mustermann@email.com',
      password: 'musterPW',
      address: {
        street: 'Muserstraße',
        houseNumber: 44,
        postCode: '89123',
        city: 'Musterstadt',
        country: 'Germany'
      },
      orders: []
    }),
    new User({
      schema_V: 1,
      name: 'Max Mustermann',
      email: 'max.mustermann@email.com',
      password: 'musterPW',
      address: {
        street: 'Muserstraße',
        houseNumber: 44,
        postCode: '89123',
        city: 'Musterstadt',
        country: 'Germany'
      },
      orders: []
    })
  ];

  private serviceTestData= [
    new Service({
      schema_V: 1,
      name: 'Schreinerarbeiten',
      description: 'Biete Schreinerarbeiten jeglicher Art an.',
      offeredBy: this.userTestData[0]._id,
      timeSlots: [
        {
          date: new Date('2022-06-01'),
          slot: 5,
          bookedStatus: {
            booked: false
          }
        }
      ]
    }),
    new Service({
      schema_V: 1,
      name: 'Schweißen von Rohren',
      offeredBy: this.userTestData[2]._id,
      timeSlots: [
        {
          date: new Date('2022-06-03'),
          slot: 7,
          bookedStatus: {
            booked: false
          }
        },
        {
          date: new Date('2022-06-03'),
          slot: 8,
          bookedStatus: {
            booked: false
          }
        },
        {
          date: new Date('2022-06-03'),
          slot: 7,
          bookedStatus: {
            booked: false
          }
        }
      ]
    }),
    new Service({
      schema_V: 1,
      name: 'Schreinerarbeiten',
      description: 'Biete Schreinerarbeiten jeglicher Art an.',
      offeredBy: this.userTestData[0]._id,
      timeSlots: [
        {
          date: new Date('2022-06-01'),
          slot: 5,
          bookedStatus: {
            booked: false
          }
        }
      ]
    })
  ];

  private async createTestData() {
    // Delete everything in the Users collection so the state of the db is known when starting the server.
    await User.deleteMany({});
    await User.insertMany(this.userTestData);

    await Service.deleteMany({});
    await Service.insertMany(this.serviceTestData);

    this.userTestData[1].orders.push({
      service_id: this.serviceTestData[0]._id,
      orderTime: new Date()
    });
    await this.userTestData[1].save();
  }
}
