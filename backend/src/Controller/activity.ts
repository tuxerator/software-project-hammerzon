import { Request, Response } from 'express';

import { SocketServer } from './socketServer';
import Helper from '../Utils/helpers';
import { Activity, IActivity, IHighlight } from '../Models/Activity';
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

  public static async addActivity(user:IUser|undefined,desc: (string|IHighlight)[]):Promise<void>
  {
    console.log(user);
    let desciption = '';
    const highlights = [];
    for(let i = 0; i < desc.length; i++)
    {
      if(Helper.isString(desc[i]))
      {
        desciption += desc[i];
      }else
      {
        desciption += `[${highlights.length}]`;
        highlights.push( desc[i] as IHighlight);
      }
    }
    await this.addActivityToDB(user,desciption,highlights);
  }
  // Adds Activity to Database
  private static async addActivityToDB(user:IUser|undefined, desc:String,highlights:IHighlight[]):Promise<void>
  {
    console.log(user);
    //const userDb = (await User.find({_id:user.id}).exec());
    //console.log(userDb);
    // Create a new Activity-Object with date = current Time+Date
    const activity = new Activity({user:user?._id,desc,date:new Date(),highlights});
    console.log(activity);
    // save object to db
    await activity.save();
    // To also Send User Information
    const userActivity: Pick<IActivity,'desc'|'highlights'|'date'> & {user:{firstName:string,lastName:string}} = {
      desc: activity.desc,
      user: {firstName:user?.firstName,lastName:user?.lastName},
      highlights: activity.highlights,
      date: activity.date
    };

    console.log(userActivity);

    console.log(user);
    // activity.user = user;
    SocketServer.socket?.onAddedActivity(userActivity);
  }

  public async getList(request:Request,response:Response):Promise<void>
  {
    const list = await Activity.find({}).populate('user','-password').exec();
    console.log(list);
    response.status(200);
    response.send(list);
  }

}

export const activity = ActivityController.getInstance();
