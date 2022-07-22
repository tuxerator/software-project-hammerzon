import { Component, OnInit } from '@angular/core';
import { Activity } from 'src/app/models/Activity';
import { getDateString } from 'src/app/models/Product';
import { ActivityService } from 'src/app/services/activity.service';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent implements OnInit {
  activities?: Activity[];

  constructor(private activityService:ActivityService) { }

  ngOnInit(): void {
    this.activityService.getActivityList().subscribe({
      next: (activities) => {
        //console.log(activities);
        activities = activities.map(x => {x.date = new Date(x.date); return x;});

        this.activities = activities.sort((a, b) => {
          return b.date.getTime() - a.date.getTime();
        });


        //console.log(this.activities);
      },
      error: (err) => {
        console.log(err.error);
      }
    });

    this.activityService.getLastAddedActivity().subscribe((activity) => {
      console.log('Added Activity', activity);
      activity.date = new Date(activity.date);
      if (this.activities) {
        this.activities = [activity].concat(this.activities);
      }
      //console.log('Added Activity',this.activities);
    });
  }

  getDateString(date:Date):string
  {
    return getDateString(date);
  }

  getDesc(desc:string):string[]
  {
    //console.log(list);
    return desc.replace(/\[/g, ']').split(']').filter(x => x !== '');
  }

  isHiglight(text: string): boolean {
    const number = parseInt(text);
    //console.log(number);
    return !!(number || number === 0);

  }

  getIndex(text:string):number
  {
    return parseInt(text);
  }
}
