import {Request,Express} from 'express';
import { IAppointment } from './Models/Order';
interface ListInfo<T> {
  list: T[], // Ergebnis Liste der Abfrage
  requestable: number // Anzahl an noch abfragbaren Elementen
}

type SessionRequest = Request & { session: Session };
export type FileRequest = Request & { file: any };

type PostOrder={
    productId : string,
    appointment : IAppointment
}
type OrderInfo = {
  _id: string,
  product: string,
  orderingUser: string,
  timeOfOrder: Date,
  finalized: boolean,
  appointment: IAppointment,
  confirmed: boolean
}


export { ListInfo, SessionRequest, PostOrder, OrderInfo };
