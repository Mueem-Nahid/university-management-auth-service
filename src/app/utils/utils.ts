import { Response } from 'express'

export const sendResponse = (
  res: Response,
  status: number,
  message: string,
  data: any = null
) => {
  return res?.status(status).json({ status, message, data })
}
