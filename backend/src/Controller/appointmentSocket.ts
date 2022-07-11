import { Server } from 'socket.io';
import { IAvailability } from '../Models/Product';
import { IUser } from '../Models/User';
import { compareAvailabilty } from '../utils';


export class AppointmentSocket {
  public static socket: AppointmentSocket;
  public appointments: { [user: string]: IAvailability[] } = {}
  private readonly server: Server;

  constructor(app: Express.Application) {
    AppointmentSocket.socket = this;
    this.server = new Server(app, {
      cors: { origin: '*' }
    });

    this.server.on('connection', (client) => {
      console.log('new client');
    });
  }

  public onAppointmnetAdded(user: IUser, appointment: IAvailability): void {
    if (!this.appointments[user._id]) {
      this.appointments[user._id] = [];
    }
    this.appointments[user._id].push(appointment);

    this.server.emit(`${ user }:appointment`, { appointment, action: 'add' });
  }

  public onAppointmnetRemoved(user: IUser, appointment: IAvailability): void {
    this.removeAppointmentWithoutSending(user, appointment);
    this.server.emit(`${ user }:appointment`, { appointment, action: 'remove' });
  }

  public removeAppointmentWithoutSending(user: IUser, appointment: IAvailability) {
    if (this.appointments[user._id]) {
      const index = this.appointments[user._id].findIndex(ap1 => compareAvailabilty(ap1, appointment) === 0);
      this.appointments[user._id] = [...this.appointments[user._id].splice(0, index), ...this.appointments[user._id].splice(index + 1, this.appointments[user._id].length)]
    }
  }

}
