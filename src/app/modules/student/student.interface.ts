import { studentSchema } from './student.model';
import { Model, InferSchemaType } from 'mongoose';

export type IStudent = InferSchemaType<typeof studentSchema>;

export type StudentModel = Model<IStudent, Record<string, unknown>>;
