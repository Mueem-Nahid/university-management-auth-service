import { RequestHandler } from 'express'
import { sendResponse } from '../../utils/utils'
import { IUser } from './user.interface'
import { UserService } from './user.service'

const createUser: RequestHandler = async (req, res, next) => {
  try {
    const { user } = req.body
    const result: IUser | null = await UserService.createUserIntoDb(user)
    return sendResponse(res, 201, 'User created successfully.', result)
  } catch (error) {
    next(error)
    // return sendResponse(res, 500, error?.message || 'Failed to create user.')
  }
}

export const UserController = {
  createUser,
}
