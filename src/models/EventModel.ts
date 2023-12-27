import mongoose, { Schema, Document } from 'mongoose';

interface Event extends Document {
  description: string;
  dayOfWeek: string;
}

const EventSchema = new Schema({
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
});

export default mongoose.model<Event>('Event', EventSchema);
