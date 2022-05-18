import { Number, Model, model, Schema, Types, Document, Query } from 'mongoose';

/**
 * Interface which describes an order.
 * @property {ObjectId} service_id The service which was boooked.
 * @property {Date} orderTime Time when the order was placed.
 */
interface IOrder {
  service_id: Types.ObjectId;
  orderTime: Date;
  finalized: boolean;
}

/**
 * Interface which describes the userSchema
 * @property {number} schema_V Version of the Schema the Document uses.
 * @property {string} name Name of the user.
 * @property {string} email E-Mail of the user.
 * @property {string} password Hashed password of the user.
 * @property {object} address Address of the user.
 * @property {IOrder[]} orders Array of all orders this user made.
 */
interface IUser {
  _id: Types.ObjectId;
  schema_V: number;
  name: string;
  email: string;
  password: string;
  address?: {
    street: string;
    houseNumber: number;
    postCode: string;
    city: string;
    country?: string;
  }
  orders: IOrder[];
}

// Schema of ordrer
const orderSchema: Schema = new Schema<IOrder, Model<IOrder>>({
  service_id: {
    type: Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  orderTime: { type: Date, required: true },
  finalized: { type: Boolean, required: true, default: false }
});

// Schema of user
const user: Schema = new Schema<IUser>({
  schema_V: { type: Number, required: true, default: 1, immutable: true },
  name: {type: String, required: true},
  email:{type: String, required: true},
  password:{type: String, required: true},
  address: {
    street: String,
    houseNumber: String,
    postCode: String,
    city: String,
    country: String
  },
  orders: { type: [orderSchema], required: true }
});

/**
 * Model of order
 */
const Order: Model<IOrder> = model<IOrder>('Order', orderSchema);
/**
 * Model of user
 */

interface UserQueryHelpers {
  allOrdersOfUser(): Query<any, Document<IUser>> & UserQueryHelpers;
}

user.query.allOrdersOfUser = function(userId: Types.ObjectId): Query<any,Document<IUser>> & UserQueryHelpers  {

  return  this.findById(userId).where('orders.finalized').equals(true).select('orders');
  // const result: IUser = await query.exec();
};
const User: Model<IUser> = model<IUser, Model<IUser, UserQueryHelpers>>('User', user);

const allOrders = async () => {
  return User.aggregate().unwind('orders').project({orders: 1}).group({_id: '$_id'});
};

const findUserById = async (userId: Types.ObjectId) => {
  return User.findById(userId);
};

export {Order, IOrder, IUser, User, allOrdersOfUser, allOrders};
