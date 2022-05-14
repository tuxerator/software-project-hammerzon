import {Request,Express} from 'express';
interface ListInfo<T> {
    list: T[], // Ergebnis Liste der Abfrage
    requestable : number // Anzahl an noch abfragbaren Elementen
}

type SessionRequest = Request & { session: Session };

type PostOrder={
    productId : string,
    timeslot: Date
}
type OrderInfo={
    _id : string,
    product : string,
    orderingUser: string,
    timeOfOrder: Date,
    finalized: boolean,
    timeslot: Date
  }


export {ListInfo,SessionRequest,PostOrder,OrderInfo};
