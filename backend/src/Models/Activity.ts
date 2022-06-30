import {Model,model,Schema,Document} from 'mongoose';
// Create a Interface
interface IActivity extends Document{
  user:string;
  activity:string;
  date:Date;
}

// 2. Create a schema
const activitySchema = new Schema<IActivity>({
  user:{type:String,require:true},
  activity:{type:String,require:true},
  date:{type:Date,require:true}
});

// 3. Create a Model and export it
export const Activity: Model<IActivity> = model<IActivity>('Activity', activitySchema);
