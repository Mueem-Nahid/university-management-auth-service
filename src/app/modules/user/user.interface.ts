import { Model, Types } from 'mongoose';
import { IStudent } from '../student/student.interface';
import { IFaculty } from '../faculty/faculty.interface';
import { IAdmin } from '../admin/admin.interface';

export type IUser = {
  id: string;
  role: string;
  password: string;
  needToChangePassword: boolean;
  passwordChangedAt?: Date;
  student?: Types.ObjectId | IStudent;
  faculty?: Types.ObjectId | IFaculty;
  admin?: Types.ObjectId | IAdmin;
};

// static methods
/* eslint-disable no-unused-vars */
export type IUserMethods = {
  isUserExist(
    id: string
  ): Promise<Pick<
    IUser,
    'id' | 'password' | 'role' | 'needToChangePassword'
  > | null>;
  isPasswordMatched(
    enteredPassword: string,
    savedPassword: string
  ): Promise<boolean>;
};

export type UserModel = Model<IUser, Record<string, unknown>, IUserMethods>;

/* another option using 'statics'
  see: https://mongoosejs.com/docs/typescript/statics-and-methods.html

  export type UserModel = {
    isUserExist(id:string)
      :Promise<Pick<IUser, 'id' | 'password' | 'needToChangePassword'>>;
  } & Model<IUser>;
*/
