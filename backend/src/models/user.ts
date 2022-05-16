import { Number, Model, model, Schema, Types, Document } from 'mongoose';

/**
 * Interface which describes an order.
 * @property {ObjectId} service_id The service which was boooked.
 * @property {Date} orderTime Time when the order was placed.
 */
interface IOrder {
  service_id: Types.ObjectId;
  orderTime: Date;
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
  orderTime: { type: Date, required: true }
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
 * Moder of user
 */
const User: Model<IUser> = model<IUser>('User', user);

export {Order, IOrder, IUser, User};
