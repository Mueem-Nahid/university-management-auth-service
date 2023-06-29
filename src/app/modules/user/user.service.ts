import { IUser } from './user.interface';
import { User } from './user.model';
import { generateStudentId } from './user.utils';
import ApiError from '../../../errors/ApiError';
import config from '../../../config';
import { IStudent } from '../student/student.interface';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import mongoose from 'mongoose';
import { Student } from '../student/student.model';
import httpStatus from 'http-status';

const createStudentIntoDb = async (
  student: IStudent,
  user: IUser
): Promise<IUser | null> => {
  let newUserAllData = null;
  const type = 'student';
  // default password
  if (!user.password) user.password = config.default_student_password as string; // type alias
  // set role
  user.role = type;
  // semester
  const academicSemester = await AcademicSemester.findOne({
    _id: student.academicSemester,
  });
  if (!academicSemester)
    throw new ApiError(httpStatus.NOT_FOUND, 'Academic semester not found.');
  // transaction
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // generate id
    user.id = student.id = await generateStudentId(academicSemester);

    const createdStudent = await Student.create([student], { session }); // array
    if (!createdStudent.length)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create student.');

    // set student _id into user.student
    user.student = createdStudent[0]._id;
    // create user
    const createdUser = await User.create([user], { session });
    if (!createdUser.length)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create user.');

    newUserAllData = createdUser[0];

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  if (newUserAllData) {
    newUserAllData = await User.findOne({ id: newUserAllData.id }).populate({
      path: 'student',
      populate: [
        {
          path: 'academicSemester',
        },
        {
          path: 'academicDepartment',
        },
        {
          path: 'academicFaculty',
        },
      ],
    });
  }

  return newUserAllData;
};

const findLastUserId = async (role: string) => {
  const lastUser = await User.findOne({ role: role }, { id: 1, _id: 0 })
    .sort({
      createdAt: -1,
    })
    .lean();
  if (role === 'student')
    return lastUser?.id ? lastUser.id.split('-')[2] : null;
  return lastUser?.id ? lastUser.id.split('-')[1] : null;
};

export const UserService = {
  createStudentIntoDb,
  findLastUserId,
};
