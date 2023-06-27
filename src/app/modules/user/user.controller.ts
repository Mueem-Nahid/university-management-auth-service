import { Request, Response } from 'express';
import { IUser } from './user.interface';
import { UserService } from './user.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';

/*const createUser = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const user = req.body;
    const result: IUser | null = await UserService.createUserIntoDb(user);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'User created successfully !',
      data: result,
    });
  }
);*/

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

export const UserController = {
  createStudent,
};
