import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable, Subject } from 'rxjs';
import { Activity } from '../models/Activity';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  public lastAddedActivityAdvanced = new Subject<Activity>();

  constructor(private http:HttpClient, private socket:Socket) {
    this.socket.on('addedActivity',(data: Activity) => {
      this.lastAddedActivityAdvanced.next(data);
    });
  }

  getLastAddedActivity():Observable<Activity>
  {
    return this.lastAddedActivityAdvanced;
  }

  // Return every Activity form Server
  getActivityList():Observable<Activity[]>{
    // Cast every activity objects date (=type String) to a date-object
    /*observable.subscribe({
      next:(activities) => {
        console.log(activities);
        activities.forEach((x) =>
          x.date = new Date(x.date)
        );
      }
    });*/

    return this.http.get<Activity[]>('/api/admin/activity/list');
  }


}
