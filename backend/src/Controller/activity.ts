import { Activity } from '../Models/Activity';
import { IUser } from '../Models/User';

// Controlls Every
export class ActivityController{
  private static instance?:ActivityController;

  // Can't create Instance of this object
  private constructor()
  {

  }

  public static getInstance():ActivityController {
    if(!this.instance)
    {
      this.instance = new ActivityController();
    }
    return this.instance;
  }

  public static addActivity(user:IUser|undefined, desc:String):void
  {
    let userName = 'Besucher:in';
    if(user)
    {
      userName = `${user.firstName} ${user.lastName}`;
    }
    // Create a new Activity-Object with date = current Time+Date
    const activity = new Activity({user:userName,activity:desc,date:new Date()});

    // save object to db
    activity.save();
  }
}
