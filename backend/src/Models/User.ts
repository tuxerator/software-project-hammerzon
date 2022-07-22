import { Schema, Model, model, Document } from 'mongoose';


// Model for Products
interface IUser extends Document {
  // Name der Dienstleistung
  firstName: string,
  lastName: string,
  // Anbieter der Dienstleistung
  email: String,
  // Genauere Beschreibung des Dienstleistung
  // Preis der Dienstleistung
  password: String,
  role: 'admin' | 'user',
  // Zeit dauer der Dienstleistung
  address: {
    street: String,
    houseNum: String, // String da es auch 10a gibt
    postCode: String,
    city: String,
    country: String,
  }
}

// create the Schema of IProduct
const userSchema : Schema = new Schema<IUser>({
  firstName:       { type: String, required: true },
  lastName:       { type: String, required: true },
  email:      { type: String, required: true },
  password:   { type: String, required: true },
  role:       { type: String, default: 'user'},
  address:    { type: {
        street:{type: String, required:true},
        houseNum:{type: String, required:true},
        postCode:{type: String, required:true},
        city:{type: String, required:true},
        country:{type: String, required:true}
  }, required: true},
});

// 3. Create a Model.
const User : Model<IUser>  = model<IUser>('User', userSchema);

const getUserWithOutPassword = (user :IUser):IUser =>
{
    return new User({
        firstName:user.firstName,
        lastName:user.lastName,
        email:user.email,
        password:'',
        role:user.role,
        address: user.address
    });
};

export {IUser,User,getUserWithOutPassword};
