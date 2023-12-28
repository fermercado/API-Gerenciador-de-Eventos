import mongoose, { Schema, Document } from 'mongoose';

interface User extends Document {
  firstName: string;
  lastName: string;
  birthDate: Date;
  city: string;
  country: string;
  email: string;
  password: string;
}

const UserSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    birthDate: { type: Date, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { versionKey: false },
);

UserSchema.set('toObject', {
  transform: function (doc, ret) {
    delete ret.password;
  },
});

export default mongoose.model<User>('User', UserSchema);
