import { model, Schema, Types } from 'mongoose';
import { FacultyModel, IFaculty } from './faculty.interface';
import { bloodGroup, gender } from './faculty.constant';

export const facultySchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: {
        firstName: {
          type: String,
          required: true,
        },
        lastName: {
          type: String,
          required: true,
        },
        middleName: {
          type: String,
          required: false,
        },
      },
      required: true,
    },
    dateOfBirth: {
      type: String,
    },
    gender: {
      type: String,
      enum: gender,
    },
    bloodGroup: {
      type: String,
      enum: bloodGroup,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    contactNo: {
      type: String,
      unique: true,
      required: true,
    },
    emergencyContactNo: {
      type: String,
      required: true,
    },
    presentAddress: {
      type: String,
      required: true,
    },
    permanentAddress: {
      type: String,
      required: true,
    },
    academicDepartment: {
      type: Types.ObjectId,
      ref: 'AcademicDepartment',
      required: true,
    },
    designation: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      // required: true,
    },
    academicFaculty: {
      type: Types.ObjectId,
      ref: 'AcademicFaculty',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Faculty = model<IFaculty, FacultyModel>('Faculty', facultySchema);
