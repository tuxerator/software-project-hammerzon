import mongoose from 'mongoose';

const { Schema } = mongoose;
const nameInfoSchema = new Schema({
  firstName: String,
  lastName: String,
  optionalAttribut: String
});

export default nameInfoSchema;
