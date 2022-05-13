import {Number,Schema,Model,model,Document} from 'mongoose';

// Model for Products
interface IProduct extends Document{
  // Name der Dienstleistung
  name:string
  // Anbieter der Dienstleistung
  user:string
  // Genauere Beschreibung des Dienstleistung
  description:string
  // Preis der Dienstleistung
  prize:number
  // Zeit dauer der Dienstleistung
  duration:Date
  // Möglichen daten wo man die Dienstleistung kaufen kann
  appointments:IAppointment[]
}

interface IAppointment{
  date:Date,
  // gibt an ob es noch zu lesen der Termin noch angegeben wird
  isReserved:boolean
}

const Appointment : Schema = new Schema<IAppointment>(
  {
    date:{type:Date,required:true},
    // gibt an ob es noch zu lesen der Termin noch angegeben wird
    isReserved:{type:Boolean,required:true}
  });


// create the Schema of IProduct
const productSchema : Schema = new Schema<IProduct>({
  name:          { type: String, required: true },
  user:          { type: String, required: true },
  description:   { type: String, required: true },
  prize:         { type: Number, required: true },
  duration:      { type: Date,   required: true },
  appointments:  { type: [Appointment], required: true }
});



// 3. Create a Model.
const Product : Model<IProduct>  = model<IProduct>('Product', productSchema);

export {IProduct,Product,IAppointment};
