import { Server } from 'socket.io';
import { IActivity } from '../Models/Activity';

export class SocketServer{
  private readonly server: Server;
  public static socket:SocketServer;
  constructor(app:Express.Application){
    SocketServer.socket = this;
    this.server = new Server(app, {
      cors: { origin: '*' }
    });

    this.server.on('connection', (client) => {
        console.log('new client');

        client.on('testMessageChannel', data => {
            console.log(data);
        });
    });
  }
  public onAddedActivity(activity:IActivity):void
  {
    this.server.emit('addedActivity', activity);
  }


}
