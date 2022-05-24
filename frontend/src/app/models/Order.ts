import { Appointment, Product } from './Product';
import { User } from './User';

export class Order {
  public _id: string;
  public product: Product;
  public orderingUser: User;
  public timeOfOrder: Date;
  public appointment: Appointment;
  public confirmed: boolean;

  constructor(id: string, product: Product, orderingUser: User, timeOfOrder: Date, finalized: boolean, appointment: Appointment, confirmed: boolean) {
    this._id = id;
    this.product = product;
    this.orderingUser = orderingUser;
    this.timeOfOrder = timeOfOrder;
    this.appointment = appointment;
    this.confirmed = confirmed;
  }
}

