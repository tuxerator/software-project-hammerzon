import { Request, Response } from 'express';
import {Types} from 'mongoose';
import Helper from '../helpers';
import { Activity, IHighlight } from '../Models/Activity';
import { IUser, User } from '../Models/User';

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
  private static async  addActivityToDB(user:IUser|undefined, desc:String,highlights:IHighlight[]):Promise<void>
  {
    console.log(user);
    //const userDb = (await User.find({_id:user.id}).exec());
    //console.log(userDb);
    // Create a new Activity-Object with date = current Time+Date
    const activity = new Activity({user:user?._id,desc,date:new Date(),highlights});
    console.log(activity);
    // save object to db
    activity.save();
  }

  public async getList(request:Request,response:Response):Promise<void>
  {
    const list = await Activity.find({}).populate('user','-password').exec();
    console.log(list);
    response.status(200);
    response.send(list);
  }

}
