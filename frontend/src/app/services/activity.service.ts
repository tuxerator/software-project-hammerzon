import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Activity } from '../models/Activity';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  constructor(private http:HttpClient) { }

  // Return every Activity form Server
  getActivityList():Observable<Activity[]>{
    const observable = this.http.get<Activity[]>('/api/admin/activity/list');
    // Cast every activity objects date (=type String) to a date-object
    /*observable.subscribe({
      next:(activities) => {
        console.log(activities);
        activities.forEach((x) =>
          x.date = new Date(x.date)
        );
      }
    });*/

    return observable;
  }
}
