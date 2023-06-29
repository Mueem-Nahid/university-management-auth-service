import { model, Schema } from 'mongoose';
import {
  IManagementDepartment,
  ManagementDepartmentModel,
} from './managementDepartment.inerface';

const managementDepartmentSchema = new Schema<
  IManagementDepartment,
  ManagementDepartmentModel
>(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const ManagementDepartment = model<
  IManagementDepartment,
  ManagementDepartmentModel
>('ManagementDepartment', managementDepartmentSchema);
