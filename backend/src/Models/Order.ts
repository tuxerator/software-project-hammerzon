import mongoose from 'mongoose';
import {Schema,Model,model,Document} from 'mongoose';

// Model for Orders

interface IOrder extends Document{
    // Bestelltes Produkt
    product : mongoose.Types.ObjectId;
    // Bestellender User, soll Referenz zum UserObject sein?
    orderingUser : mongoose.Types.ObjectId;
    status: Status;
    // Bestellzeitpunkt
    appointment : IAppointment;
    confirmed : boolean;
    timeOfOrder:Date
}

enum Status {
    NNA = 'Noch nicht angenommen',
    A = 'Angenommen',
    D = 'Durchgeführt'
}
// make enum 0 ,1 ,2 translate in controller

interface IAppointment {
    startDate: Date,
    endDate: Date,
}

const orderSchema : Schema = new Schema<IOrder>({
    product:        { type: mongoose.Schema.Types.ObjectId, ref: 'Product' ,required: true },
    orderingUser:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' , required: true },
    status:         { type: String, enum: Status, default: Status.NNA, requiered: true},
    appointment:    { type: {
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
    }, required: true, _id: false },
    confirmed:      { type: Boolean, default: false },
    timeOfOrder: {type:Date,required:true}
});

const Order : Model<IOrder> = model<IOrder>('Order', orderSchema);

export {IOrder, Order, Status, IAppointment};
