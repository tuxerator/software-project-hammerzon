import mongoose from 'mongoose';
import {Schema,Model,model,Document} from 'mongoose';

// Model for Orders

interface IOrder extends Document{
    // Bestelltes Produkt
    product : mongoose.Types.ObjectId;
    // Bestellender User, soll Referenz zum UserObject sein?
    orderingUser : mongoose.Types.ObjectId;
    // Bestellzeitpunkt
    appointment : IAppointment;
    confirmed : boolean;
    createdAt : Date;
    updatedAt : Date;
}

enum Status {
    NNA = 'Noch nicht angenommen',
    A = 'Angenommen',
    D = 'Durchgeführt'
}
// make enum 0 ,1 ,2 translate in controller

interface IAppointment {
    startTime: Date,
    endTime: Date,
}

const orderSchema : Schema = new Schema<IOrder>({
    product:        { type: mongoose.Schema.Types.ObjectId, ref: 'Product' ,required: true },
    orderingUser:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' , required: true },
    status:         { type: String, enum: Status, default: Status.NNA, requiered: true},
    appointment:    { type: {
        startTime: { type: Date, required: true },
        endTime: { type: Date, required: true },
    }, required: true, _id: false },
    confirmed:      { type: Boolean, default: false },
}, { timestamps: true });

const Order : Model<IOrder> = model<IOrder>('Order', orderSchema);

export {IOrder, Order, Status, IAppointment};
