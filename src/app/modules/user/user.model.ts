import { model, Schema } from 'mongoose';
import { IUser, IUserMethods, UserModel } from './user.interface';
import { hashPassword } from '../../../helpers/hashPassword';

const userSchema = new Schema<IUser, Record<string, never>, IUserMethods>(
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
      select: 0,
    },
    needToChangePassword: {
      type: Boolean,
      default: true,
    },
    passwordChangedAt: {
      type: Date,
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

// instance method
userSchema.methods.isUserExist = async function (
  id: string
): Promise<Pick<
  IUser,
  'id' | 'password' | 'role' | 'needToChangePassword'
> | null> {
  return User.findOne(
    { id },
    { id: 1, password: 1, role: 1, needToChangePassword: 1 }
  ).lean();
};

userSchema.methods.isPasswordMatched = async function (
  enteredPassword: string,
  savedPassword: string
): Promise<boolean> {
  return hashPassword.decryptPassword(enteredPassword, savedPassword);
};

// hash password using pre hook middleware (fat model thin controller)
// User.create() / user.save()
userSchema.pre('save', async function (next) {
  this.password = await hashPassword.encryptPassword(this.password);
  if (!this.needToChangePassword) this.passwordChangedAt = new Date();
  next();
});

export const User = model<IUser, UserModel>('User', userSchema);

/*
userSchema.statics.isUserExist = async function (id: string): Promise<Pick<IUser, 'id' | 'password' | 'needToChangePassword'> | null> {
  return User.findOne(
    {id},
    {id: 1, password: 1, needToChangePassword: 1}
  ).lean();
};

access this from service using: User.isUserExist()
*/
