import { Server } from 'socket.io';
import { IAvailability } from '../Models/Product';
import { IUser } from '../Models/User';
import { compareAvailabilty } from '../Utils/utils';
import { IActivity } from '../Models/Activity';

export class SocketServer{

  private readonly server: Server;
  public static socket?:SocketServer;

  public appointments: { [user: string]: IAvailability[] } = {};
  constructor(app:Express.Application){
    SocketServer.socket = this;
    this.server = new Server(app, {
      cors: { origin: '*' }
    });

    this.server.on('connection', (client) => {
        console.log('new client');

        client.on('testMessageChannel', (data) => {
            console.log(data);
        });
    });
  }
  public onAddedActivity(activity:Pick<IActivity,'desc'|'highlights'|'date'> & {user:{firstName:string,lastName:string}}):void
  {
    this.server.emit('addedActivity', activity);
  }

  public onAppointmnetAdded(user: IUser, appointment: IAvailability): void {
    if (!this.appointments[user._id]) {
      this.appointments[user._id] = [];
    }
    this.appointments[user._id].push(appointment);

    this.server.emit(`${ user._id }:appointment`, { appointment, action: 'add' });
  }

  public onAppointmnetRemoved(user: IUser, appointment: IAvailability): void {
    this.removeAppointmentWithoutNotify(user, appointment);
    this.server.emit(`${ user }:appointment`, { appointment, action: 'remove' });
  }

  public removeAppointmentWithoutNotify(user: IUser, appointment: IAvailability): void {
    if (this.appointments[user._id]) {
      const index = this.appointments[user._id].findIndex(ap1 => compareAvailabilty(ap1, appointment) === 0);
      this.appointments[user._id] = [...this.appointments[user._id].splice(0, index), ...this.appointments[user._id].splice(index + 1, this.appointments[user._id].length)];
    }
  }
}
