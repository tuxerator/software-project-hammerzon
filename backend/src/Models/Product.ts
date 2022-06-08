import mongoose from 'mongoose';
import { Number, Schema, Model, model, Document } from 'mongoose';

// Model for Products
interface IProduct extends Document {
    // Name der Dienstleistung
    name: string
    // Anbieter der Dienstleistung
    user: string
    // Genauere Beschreibung des Dienstleistung
    description: string
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

    image_id: mongoose.Types.ObjectId
}

interface IAvailability {
    startDate: Date,
    endDate: Date,
}

const Availability: Schema = new Schema<IAvailability>({
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
});


// create the Schema of IProduct
const productSchema: Schema = new Schema<IProduct>({
    name: { type: String, required: true },
    user: { type: String, ref: 'User', required: true },
    description: { type: String },
    prize: { type: Number, required: true },
    duration: { type: Date, required: true },
    defaultTimeFrame: {
        start: { type: Date, required: true, max: Date.UTC(0, 0, 0, 23, 59, 59) },
        end: { type: Date, required: true, max: Date.UTC(0,0,0,23,59,59) }
    },
    availability: { type: [Availability], required: true },
    image_id: { type: mongoose.Schema.Types.ObjectId, required: true }
});


// 3. Create a Model.
const Product: Model<IProduct> = model<IProduct>('Product', productSchema);


export { IProduct, Product, IAvailability };
