import { Request, RequestHandler, Response } from 'express';
import { IUser } from './user.interface';
import { UserService } from './user.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';

const createStudent = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { student, ...userData } = req.body;
    const result: IUser | null = await UserService.createStudentIntoDb(
      student,
      userData
    );
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Student created successfully !',
      data: result,
    });
  }
);

const createFaculty: RequestHandler = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { faculty, ...userData } = req.body;
    const result = await UserService.createFacultyIntoDb(faculty, userData);

    sendResponse<IUser>(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Faculty created successfully!',
      data: result,
    });
  }
);

const createAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { admin, ...userData } = req.body;
    const result = await UserService.createAdminIntoDb(admin, userData);

    sendResponse<IUser>(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Admin created successfully!',
      data: result,
    });
  }
);

export const UserController = {
  createStudent,
  createFaculty,
  createAdmin,
};
