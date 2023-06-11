import { RequestHandler } from 'express';
import { IUser } from './user.interface';
import { UserService } from './user.service';

const createUser: RequestHandler = async (req, res, next) => {
  try {
    const user = req.body;
    const result: IUser | null = await UserService.createUserIntoDb(user);
    res.status(201).json({
      success: true,
      message: 'User created successfully !',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const UserController = {
  createUser,
};
