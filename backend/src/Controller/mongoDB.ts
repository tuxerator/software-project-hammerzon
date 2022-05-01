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
import nameInfoSchema from '../Models/NameInfoSchema';

export class MongoDBController {

  constructor() {
    this.initConnection().catch(err => console.log(err));
  }

  async initConnection() {
    await mongoose.connect('mongodb://localhost:27017/swp'); // Connect to MongoDB
    console.log(mongoose.connection.readyState); // Prints 1 if connected successfully

    const testSchema = new mongoose.Schema({ test: String }, { collection: 'test' });
    const test = mongoose.model('test', testSchema);

    test.findOne({}, function (err: any, result: { test: any; }) {
      if (err) console.log(err);
      console.log(result.test);
    });
  }
}
