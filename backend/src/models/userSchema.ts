import mongoose, {Schema} from 'mongoose';
const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new Schema({
  schema: Number,
  name: String,
  email: String,
  password: String,
  address: {
    street: String,
    houseNumber: Number,
    postCode: String,
    city: String,
    country: String
  },
  orders: {
    service_id: ObjectId,

  }
});
