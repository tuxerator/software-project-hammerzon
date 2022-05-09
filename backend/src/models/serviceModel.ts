import mongoose, { Schema, model, Types } from 'mongoose';

export interface IService {
  schema: number,
  offeredBy: Types.ObjectId,
  name: string,
  description?: string,
  timeSlots: [{
    date: Date,
    slot: number,
    bookedStatus: IBookedStatus
  }]
}

interface IBookedStatus {
  booked: boolean,
  bookedBy?: Types.ObjectId
}

const bookedStatusSchema = new Schema<IBookedStatus>({
  booked: { type: Boolean, required: true, default: false },
  bookedBy: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
    required: function () {
      return this.booked;
    }
  }
})

const serviceSchema = new Schema<IService>({
  schema: { type: Number, required: true, default: 1, immutable: true },
  offeredBy: { type: Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  description: String,
  timeSlots: [{
    date: {type: Date, required: true},
    slot: { type: Number, required: true, min: 0, max: 23 },
    bookedStatus: { type: bookedStatusSchema, required: true},
  }]
})

export const Service = model<IService>('Service', serviceSchema);
