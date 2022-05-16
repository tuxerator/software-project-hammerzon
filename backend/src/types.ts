import {Request,Express} from 'express';
import { Appointment, IAppointment } from './Models/Product';
interface ListInfo<T> {
    list: T[], // Ergebnis Liste der Abfrage
    requestable : number // Anzahl an noch abfragbaren Elementen
}

type SessionRequest = Request & { session: Session };

type PostOrder={
    productId : string,
    appointmentIndex : Number
}
type OrderInfo={
    _id : string,
    product : string,
    orderingUser: string,
    timeOfOrder: Date,
    finalized: boolean,
    appointment : IAppointment
}


export {ListInfo,SessionRequest,PostOrder,OrderInfo};
