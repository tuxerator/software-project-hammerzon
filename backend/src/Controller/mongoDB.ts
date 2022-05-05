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

export class MongoDBController {

  constructor() {
    this.initConnection().catch(err => console.log(err));
  }

  async initConnection(): Promise<void> {
    await mongoose.connect('mongodb://localhost:27017/swp'); // Connect to MongoDB
    console.log(mongoose.connection.readyState); // Prints 1 if connected successfully
  }
}
