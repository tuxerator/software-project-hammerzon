import mongoose, { Schema, model, Types, Model } from 'mongoose';
import {ObjectId} from 'mongodb';

/**
 * Interface which describes the serviceSchema.
 * @param {number} schema_V Version of the Schema the Document uses.
 * @param offeredBy ObjectID of the user who is offering this service.
 * @param name Name of the service.
 * @param description Optional description of the service.
 * @param timeSlots Array of the time slots when the service can be booked.
 */
interface IService {
  schema_V: number;
  offeredBy: Types.ObjectId;
  name: string;
  description?: string;
  timeSlots: [{
    date: Date;
    slot: number;
    bookedStatus: IBookedStatus;
  }]
}

/**
 * Interface of the bookedStatusSchema
 * @param booked Whether the corresponding timeSlot is booked or not.
 * @param bookedBy ObjectId of the user who booked this timeSlot.
 */
interface IBookedStatus {
  booked: boolean;
  bookedBy?: Types.ObjectId;
}

// Schema of bookedStatus
const bookedStatusSchema: Schema<IBookedStatus> = new Schema<IBookedStatus>({
  booked: { type: Boolean, required: true, default: false },
  bookedBy: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
    required: function () {
      return this.booked;
    }
  }
});

// Schema of service
const serviceSchema: Schema<IService> = new Schema<IService>({
  schema_V: { type: Number, required: true, default: 1, immutable: true },
  offeredBy: { type: Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  description: String,
  timeSlots: [{
    date: {type: Date, required: true},
    slot: { type: Number, required: true, min: 0, max: 23 },
    bookedStatus: { type: bookedStatusSchema, required: true},
  }]
});

/**
 * Model of serviceSchema
 */
const Service: Model<IService> = model<IService>('Service', serviceSchema);

export {Service, IService, IBookedStatus};
