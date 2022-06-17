import mongoose from 'mongoose';
import { Number, Schema, Model, model, Document } from 'mongoose';

// Model for Products
interface IProduct extends Document{
    // Name der Dienstleistung
  name:string
  // Anbieter der Dienstleistung
  user:mongoose.Types.ObjectId
  // Genauere Beschreibung des Dienstleistung
  description:string
  // Preis der Dienstleistung
  prize:number
  // Zeit dauer der Dienstleistung
  duration:Date
    // Möglichen daten wo man die Dienstleistung kaufen kann
  appointments: IAppointment[]

  image_id: mongoose.Types.ObjectId

  numberOfRatings : number
  rating : number

  comments : string[]
}

interface IAppointment {
  date: Date,
  // gibt an ob es noch zu lesen der Termin noch angegeben wird
  isReserved: boolean
}

const Appointment: Schema = new Schema<IAppointment>(
  {
    date: { type: Date, required: true },
    // gibt an ob es noch zu lesen der Termin noch angegeben wird
    isReserved: { type: Boolean, required: true }
  });


// create the Schema of IProduct
const productSchema : Schema = new Schema<IProduct>({
  name:            { type: String, required: true },
  user:            { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description:     { type: String },
  prize:           { type: Number, required: true },
  duration:        { type: Date,   required: true },
  appointments:    { type: [Appointment], required: true },
  image_id:        { type: mongoose.Schema.Types.ObjectId, required: true },
  numberOfRatings: { type: Number , min : 0, required : true},
  rating:          { type: Number , min : 1, max : 5, required : true},
  comments:        { type: [String], required : true}
});


// 3. Create a Model.
const Product: Model<IProduct> = model<IProduct>('Product', productSchema);


export { IProduct, Product, IAppointment, Appointment };
