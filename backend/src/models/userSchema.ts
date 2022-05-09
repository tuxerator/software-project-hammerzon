import { Model, model, Schema, Types } from 'mongoose';

export interface IOrder {
  service_id: Types.ObjectId;
  orderTime: Date;
}

export interface IUser {
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
}

const orderSchema = new Schema<IOrder, Model<IOrder>>({
  service_id: {
    type: Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  orderTime: { type: Date, required: true, default: Date.now }
});

const userSchema = new Schema<IUser, Model<IUser>>({
  schema: { type: Number, required: true, default: 1, immutable: true },
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
  orders: { type: [orderSchema], default: undefined }
});

export const Order = model<IOrder>('Order', orderSchema);
export const User = model<IUser>('User', userSchema);
