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
import mongoose from 'mongoose';
import ProductTestData from '../TestData/productTestData';
import OrderTestData from '../TestData/orderTestData';
import UserTestData from '../TestData/userTestData';
import {MongoMemoryServer} from 'mongodb-memory-server';
import { AppOptions } from '../types';
import Lazy from '../Utils/lazy';

export class MongoDBController {

  mongod?:MongoMemoryServer;
  constructor(options?:Partial<AppOptions>) {
    if(options?.testing)
    {
      console.log('in here');
      this.initMemoryDb();
    }else{
      console.log('in there');
      this.initConnection().catch(err => console.log(err));
    }
  }

  async initConnection(): Promise<void> {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/swp'); // Connect to MongoDB
    console.log(`Database is ${ (mongoose.connection.readyState === 1) ? 'ready' : 'errored' }`); // Prints 1 if connected successfully
    new ProductTestData();
    new OrderTestData();
    new UserTestData();
  }

  async initMemoryDb(): Promise<void>
  {
      //await this.mongod.start();
      this.mongod = await MongoMemoryServer.create();
      const uri = await this.mongod.getUri();
      console.log(uri);
      const mongooseOpts = {
          dbName:'TestingDb'
      };

      await mongoose.connect(uri, mongooseOpts);

  }
  async disconnectDB(): Promise<void> {
    await mongoose.disconnect();
  }

}
export const mongodb = new Lazy<MongoDBController>( (options?:Partial<AppOptions>) => new MongoDBController(options));
