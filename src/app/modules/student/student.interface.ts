import { studentSchema } from './student.model';
import { Model, InferSchemaType } from 'mongoose';

export type IStudent = InferSchemaType<typeof studentSchema>;

export type IStudentFilters = {
  searchTerm?: string;
  id?: string;
  bloodGroup?: string;
  email?: string;
  contactNo?: string;
  emergencyContactNo?: string;
};

export type StudentModel = Model<IStudent, Record<string, unknown>>;
