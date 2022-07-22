import mongoose from 'mongoose';
import { Number, Schema, Model, model, Document } from 'mongoose';
import { User } from './User';

// Model for Products
interface IProduct extends Document {
    // Name der Dienstleistung
  name: string
  // Anbieter der Dienstleistung
  user:mongoose.Types.ObjectId
  // Genauere Beschreibung des Dienstleistung
  description: string
  // ngrams für bessere Suche
  ngrams : string
  // prefix ngrams für weniger false positives
  prefixNgrams : string
  // Preis der Dienstleistung
  prize: number
  // Zeit dauer der Dienstleistung
  duration: Date
    // Default timeframe for availability
    defaultTimeFrame: {
        start: Date,
        end: Date
    },
    // Möglichen daten wo man die Dienstleistung kaufen kann
    availability: IAvailability[]

    category: mongoose.Types.ObjectId
  image_id: mongoose.Types.ObjectId

  numberOfRatings : number

  averageRating : number
  ratings : IRating[]
}

interface IAvailability {
  startDate: Date;
  endDate: Date;
}

interface IRating extends Document {
  rating : number,
  comment : string,
  user : mongoose.Types.ObjectId,
  date : Date,
  helpfulUsers : String[]
}

const Rating : Schema = new Schema<IRating>(
  {
    rating: {type: Number , required : true},
    comment : {type : String, required :true},
    user : {type : mongoose.Schema.Types.ObjectId, ref : User , required : true},
    date : {type : Date, required : true},
    helpfulUsers : {type : [String] , required : true}
  });


const Availability: Schema = new Schema<IAvailability>({
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
});


// create the Schema of IProduct
const productSchema : Schema = new Schema<IProduct>({
  name:            { type: String, required: true },
  user:            { type: Schema.Types.ObjectId, ref: 'User', required: true },
  description:     { type: String },
  ngrams:          { type: String , required : true},
  prefixNgrams:    { type: String , required : true},
  prize:           { type: Number, required: true },
  duration:        { type: Date,   required: true },
  defaultTimeFrame: {
    start: { type: Date, required: true, max: 24 * 60 * 60 * 1000 },
    end: { type: Date, required: true, max: 24 * 60 * 60 * 1000 },
  },
  availability:    { type: [Availability], required: true, _id: false },
  image_id:        { type: mongoose.Schema.Types.ObjectId, required: true },
  category:   { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true},
  numberOfRatings: { type: Number , min : 0, required : true, default : 0},
  averageRating:   { type: Number, required : true, default : 1 },
  ratings:          { type: [Rating] , required : true, default : []},
});
// Index für alle Strings im element
productSchema.index({
  'ngrams': 'text',
  'prefixNgrams' : 'text',
  'description':'text'
},
{
  weights : {
    ngrams : 100,
    prefixNgrams : 200
  }
}
);

// 3. Create a Model.
const Product: Model<IProduct> = model<IProduct>('Product', productSchema);


export { IProduct, Product, IAvailability, IRating };
