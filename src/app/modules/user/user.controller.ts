import { Request, Response } from 'express'
import userService from './user.service'
import { sendResponse } from '../../utils/utils'
import { IUser } from './user.interface'

const createUser = async (req: Request, res: Response) => {
  try {
    const { user } = req.body
    const result: IUser | null = await userService.createUserIntoDb(user)
    return sendResponse(res, 201, 'User created successfully.', result)
  } catch (error) {
    return sendResponse(res, 500, error?.message || 'Failed to create user.')
  }
}

export default {
  createUser,
}
