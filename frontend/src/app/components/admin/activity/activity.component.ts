import { Component, OnInit } from '@angular/core';
import { Activity, Highlight } from 'src/app/models/Activity';
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

        console.log(this.activities);
      },
      error: (err) => {
        console.log(err.error);
      }
    });

    this.activityService.getLastAddedActivity().subscribe((activity) => {
      console.log('Added Activity',activity);
      activity.date = new Date(activity.date);
      this.activities?.push(activity);
      console.log('Added Activity',this.activities);
    });
  }

  getDateString(date:Date):string
  {
    return getAppointmentString(date);
  }

  getDesc(desc:string):string[]
  {
    const list =  desc.replace(/\[/g,']').split(']').filter( x => x !== '');
    console.log(list);
    return list;
  }

  isHiglight(text:string):boolean
  {
    const number = parseInt(text);
    console.log(number);
    if(number || number === 0)
    {
      return true;
    }
    return false;
  }

  getIndex(text:string):number
  {
    const number = parseInt(text);
    return number;
  }
}
