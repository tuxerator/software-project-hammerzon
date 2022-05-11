import mongoose from 'mongoose';
import {Schema,Model,model,Document} from 'mongoose';
import { IProduct, Product } from './Product';

// Model for Orders

interface IOrder extends Document{

    // Bestelltes Produkt
    product : mongoose.Types.ObjectId
    // Bestellender User, soll Referenz zum UserObject sein?
    orderingUser: string
    // Bestellzeitpunkt
    timeOfOrder: Date

}
const orderSchema : Schema = new Schema<IOrder>({
    product:        { type: mongoose.Schema.Types.ObjectId, ref: 'Product' ,required: true },
    orderingUser:   { type: String, required: true },
    timeOfOrder:    { type: Date, required: true }
});

const Order : Model<IOrder> = model<IOrder>('Order', orderSchema);

export {IOrder, Order};