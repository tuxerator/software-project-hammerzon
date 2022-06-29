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
import { Model } from 'mongoose';
import ProductTestData from '../productTestData';
import OrderTestData from '../orderTestData';
import UserTestData from '../userTestData';
import { userSchema ,IUser } from '../Schemas/User';
import { productSchema, IProduct} from '../Schemas/Product';
import { orderSchema, IOrder } from '../Schemas/Order';
import { imageSchema, Iimage } from '../Schemas/Image';
import { categorySchema, ICategory } from '../Schemas/Category';


class MongoDBController {
  standartConnection : mongoose.Connection;
  testConnection : mongoose.Connection;
  User : Model<IUser>;
  Product : Model<IProduct>;
  Order : Model<IOrder>;
  Image : Model<Iimage>;
  Category : Model<ICategory>;

  UserTest : Model<IUser>;

  constructor() {
    //this.initStandartConnection().catch(err => console.log(err));
  }

  initStandartConnection(): void {

    this.standartConnection = mongoose.createConnection('mongodb://localhost:27017/swp'); // Connect to MongoDB
    console.log(this.standartConnection.readyState);
    this.standartConnection.once('open', () => {
      console.log(`Database is ${ (this.standartConnection.readyState === 1) ? 'ready' : 'errored' }`); // Prints 1 if connected successfully
      this.User = this.standartConnection.model('User', userSchema);
      this.Product = this.standartConnection.model('Product', productSchema);
      this.Order = this.standartConnection.model('Order', orderSchema);
      this.Image = this.standartConnection.model('Image', imageSchema);
      this.Category = this.standartConnection.model('Category', categorySchema);
      this.UserTest = this.standartConnection.model('UserTest', userSchema);
      new ProductTestData();
      //new OrderTestData();
      //new UserTestData();
      new UserTestData();    
    });

  }
}

const db = new MongoDBController();
export {db};
