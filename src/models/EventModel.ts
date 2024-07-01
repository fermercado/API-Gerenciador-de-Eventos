import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEvent extends Document {
  description: string;
  dayOfWeek: string;
  userId: string;
}

const EventSchema: Schema = new Schema(
  {
    description: { type: String, required: true },
    dayOfWeek: {
      type: String,
      enum: [
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
      ],
      required: true,
    },
    userId: { type: String, required: true },
  },
  { versionKey: false },
);

const EventModel: Model<IEvent> = mongoose.model<IEvent>('Event', EventSchema);
export default EventModel;
