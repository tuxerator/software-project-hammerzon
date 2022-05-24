import mongoose from 'mongoose';
import {Schema,Model,model,Document} from 'mongoose';
import { Appointment, IAppointment } from './Product';


// Model for Orders

interface IOrder extends Document{

    // Bestelltes Produkt
    product : mongoose.Types.ObjectId
    // Bestellender User, soll Referenz zum UserObject sein?
    orderingUser : mongoose.Types.ObjectId
    // Bestellzeitpunkt
    timeOfOrder : Date


    appointment : IAppointment

    confirmed : boolean
}



const orderSchema : Schema = new Schema<IOrder>({
    product:        { type: mongoose.Schema.Types.ObjectId, ref: 'Product' ,required: true },
    orderingUser:   { type: mongoose.Schema.Types.ObjectId, required: true },
    timeOfOrder:    { type: Date, required: true },
    appointment:    { type: Appointment, requiered: true },
});

const Order : Model<IOrder> = model<IOrder>('Order', orderSchema);

export {IOrder, Order};