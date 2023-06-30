import { model, Schema } from 'mongoose';
import { IUser, UserModel } from './user.interface';
import { hashPassword } from '../../../helpers/hashPassword';

const userSchema = new Schema<IUser>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
    },
    faculty: {
      type: Schema.Types.ObjectId,
      ref: 'Faculty',
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

// hash password using pre hook middleware (fat model thin controller)
// User.create() / user.save()
userSchema.pre('save', async function (next) {
  this.password = await hashPassword.encryptPassword(this.password);
  next();
});

export const User = model<IUser, UserModel>('User', userSchema);
