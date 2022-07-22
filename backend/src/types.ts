import { Request } from 'express';
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

export enum PaymentType {
  HCIPAL,
  SWPSAFE,
  BACHELORCARD
}

/**
 * type for both HCIPal and SWPsafe requests
 */
export type HciPalSWPRequest = {
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

export type AppOptions = {
  testing:boolean
}




export { ListInfo, SessionRequest, PostOrder, OrderInfo };
