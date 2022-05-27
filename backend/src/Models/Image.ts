import mongoose from 'mongoose';
import {Schema,Model,model,Document} from 'mongoose';


// Model for Orders

interface Iimage extends Document{

    // Bestelltes Produkt
    data:Buffer,
    type:string
}

const imageSchema:Schema = new Schema<Iimage>({
    type:{type:String,required:true},
    data:{type:Buffer,required:true}
});

const Image : Model<Iimage> = model<Iimage>('Image', imageSchema);

export {Image,Iimage};

