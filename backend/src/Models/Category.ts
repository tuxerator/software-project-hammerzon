
import { Schema, Model, model, Document, Types } from 'mongoose';

export interface ICategory extends Document {
  // Name of category
  name:string,
  //
  image_id:Types.ObjectId

  color:string

  icon:string

  custom:boolean
}

// create the Schema of IProduct
const categorySchema: Schema = new Schema<ICategory>({
  name: { type: String, required: true },
  image_id: { type: Schema.Types.ObjectId, ref:'Image', required: true },
  color:{type:String, required:true},
  icon:{type:String, required:true},
  custom:{type:Boolean, required:true}
});

// 3. Create a Model.
export const Category: Model<ICategory> = model<ICategory>('Category', categorySchema);
