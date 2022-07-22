import {Model,model,Schema,Document,Types} from 'mongoose';
import { User } from './User';
// Create a Interface
export interface IActivity extends Document{
  user:Types.ObjectId;
  desc:string;

  highlights:IHighlight[]
  date:Date;
}

export interface IHighlight {
  text:string;
  bsColor:string;
}

const Highlight = new Schema<IHighlight>({
  text:{type:String,reguire:true},
  bsColor:{type:String,reguire:true}
});

// 2. Create a schema
const activitySchema = new Schema<IActivity>({
  user:{type:Schema.Types.ObjectId,ref:User,require:true},
  desc:{type:String,require:true},
  date:{type:Date,require:true},
  highlights:{type:[Highlight],required:false}
});

// 3. Create a Model and export it
export const Activity: Model<IActivity> = model<IActivity>('Activity', activitySchema);

export const color = (text:string,color:string):IHighlight => {
  return {text,bsColor:color};
};
export const red = (text:string):IHighlight => color(text,'danger');
export const blue = (text:string):IHighlight => color(text,'primary');
export const yellow = (text:string):IHighlight => color(text,'warning');
export const green = (text:string):IHighlight => color(text,'success');
export const white = (text:string):IHighlight => color(text,'white');
export const lightGrey = (text:string):IHighlight => color(text,'secondary');
export const lightBlue = (text:string):IHighlight => color(text,'info');
