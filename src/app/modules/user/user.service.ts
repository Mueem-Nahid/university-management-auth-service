import { IUser } from './user.interface';
import { User } from './user.model';
import { generateAdminOrFacultyId, generateStudentId } from './user.utils';
import ApiError from '../../../errors/ApiError';
import config from '../../../config';
import { IStudent } from '../student/student.interface';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import mongoose from 'mongoose';
import { Student } from '../student/student.model';
import httpStatus from 'http-status';
import { IFaculty } from '../faculty/faculty.interface';
import { Faculty } from '../faculty/faculty.model';
import { IAdmin } from '../admin/admin.interface';
import { Admin } from '../admin/admin.model';

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

const createFacultyIntoDb = async (
  faculty: IFaculty,
  user: IUser
): Promise<IUser | null> => {
  let newUserAllData = null;
  const type = 'faculty';
  // default password
  if (!user.password) user.password = config.default_faculty_pass as string;
  // set role
  user.role = type;

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    user.id = faculty.id = await generateAdminOrFacultyId('F', type);

    const newFaculty = await Faculty.create([faculty], { session });

    if (!newFaculty.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create faculty.');
    }

    user.faculty = newFaculty[0]._id;

    const newUser = await User.create([user], { session });
    if (!newUser.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create user.');
    }

    newUserAllData = newUser[0];

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  if (newUserAllData) {
    newUserAllData = await User.findOne({ id: newUserAllData.id }).populate({
      path: type,
      populate: [
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

const createAdminIntoDb = async (
  admin: IAdmin,
  user: IUser
): Promise<IUser | null> => {
  let newUserAllData = null;
  const type = 'admin';
  // default password
  if (!user.password) {
    user.password = config.default_admin_pass as string;
  }
  // set role
  user.role = type;

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    user.id = admin.id = await generateAdminOrFacultyId('A', type);

    const newAdmin = await Admin.create([admin], { session });

    if (!newAdmin.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create admin.');
    }

    user.admin = newAdmin[0]._id;

    const newUser = await User.create([user], { session });

    if (!newUser.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create user.');
    }
    newUserAllData = newUser[0];

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  if (newUserAllData) {
    newUserAllData = await User.findOne({ id: newUserAllData.id }).populate({
      path: type,
      populate: [
        {
          path: 'managementDepartment',
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
  createFacultyIntoDb,
  createAdminIntoDb,
  findLastUserId,
};
