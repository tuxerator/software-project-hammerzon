import { Component, OnInit } from '@angular/core';
import { Activity } from 'src/app/models/Activity';
import { getAppointmentString } from 'src/app/models/Product';
import { ActivityService } from 'src/app/services/activity.service';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent implements OnInit {
  activities?:Activity[];

  constructor(private activityService:ActivityService) { }

  ngOnInit(): void {
    this.activityService.getActivityList().subscribe({
      next: (activities) => {
        console.log(activities);
        activities = activities.map(x => {x.date = new Date(x.date); return x;});

        this.activities = activities;


      },
      error: (err) => {
        console.log(err.error);
      }
    });
  }

  getDateString(date:Date):string
  {
    return getAppointmentString(date);
  }

}
