import { Request, Response } from 'express'

export const createUser = async (req: Request, res: Response) => {
  try {
    console.log('=>\n', res, req)
  } catch (err) {
    console.log(err)
  }
}
