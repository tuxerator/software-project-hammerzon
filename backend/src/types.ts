import { Request, Express } from 'express';
import { Appointment, IAppointment } from './Models/Product';

interface ListInfo<T> {
  list: T[], // Ergebnis Liste der Abfrage
  requestable: number // Anzahl an noch abfragbaren Elementen
}

type SessionRequest = Request & { session: Session };
export type FileRequest = Request & { file: any };

type PostOrder={
    productId : string,
    appointmentIndex : number
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

export enum PaymentType {
  HCIPAL,
  //SWPSAFE,
  BACHELORCARD,
}


export type HciPalRequest = {
  postOrder : PostOrder,
  accountPassword : string,
  accountName : string,
  paymentType : number
}

export type BachelorCardRequest = {
  postOrder : PostOrder,
  merchantName : string,
  cardNumber : string,
  fullName : string,
  securityCode : string,
  expirationDate : string,
  paymentType : number
}



export { ListInfo, SessionRequest, PostOrder, OrderInfo };
