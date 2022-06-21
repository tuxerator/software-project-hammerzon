import { Availability, Product } from './Product';
import { User } from './User';

export class Order{
    public _id : string;
    public product : Product;
    public orderingUser : User;
    public timeOfOrder : Date;
    public appointment : Availability;
    public status : Status;

    constructor(id: string, product: Product, orderingUser: User, timeOfOrder: Date, finalized: boolean, appointment: Availability, status: Status)
    {
        this._id = id;
        this.product = product;
        this.orderingUser = orderingUser;
        this.timeOfOrder = timeOfOrder;
        this.appointment = appointment;
        this.status = status;
    }
}

export enum Status {
    NNA = 'Noch nicht angenommen',
    A = 'Angenommen',
    D = 'Durchgeführt'
}

