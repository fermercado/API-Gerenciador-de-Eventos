import mongoose, { Schema, Document, Model } from 'mongoose';
import { formatDateToBrazilian } from '../utils/dateUtils';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  birthDate: Date;
  city: string;
  country: string;
  email: string;
  password: string;
}

const UserSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    birthDate: { type: Date, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

UserSchema.set('toObject', {
  transform: function (doc, ret) {
    delete ret.password;
    if (ret.birthDate) {
      ret.birthDate = formatDateToBrazilian(ret.birthDate);
    }
    return ret;
  },
});

UserSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.password;
    if (ret.birthDate) {
      ret.birthDate = formatDateToBrazilian(ret.birthDate);
    }
    return ret;
  },
});

const UserModel: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

export default UserModel;
