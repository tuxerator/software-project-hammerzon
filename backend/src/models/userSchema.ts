import { Number, Model, model, Schema, Types, Document } from 'mongoose';

interface IOrder {
  service_id: Types.ObjectId;
  orderTime: string;
}

interface IUser extends Document {
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

/*type UserDocumentProps = {
  schema: number;
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
  orders: Types.DocumentArray<IOrder>;
}*/

// type UserModelType = Model<IUser, {}, UserDocumentProps>;

const orderSchema: Schema = new Schema<IOrder, Model<IOrder>>({
  service_id: {
    type: Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  orderTime: { type: String, required: true }
});

const userSchema: Schema = new Schema<IUser>({
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

const Order: Model<IOrder> = model<IOrder>('Order', orderSchema);
const User: Model<IUser> = model<IUser>('User', userSchema);

export {Order, IOrder, IUser,User};
