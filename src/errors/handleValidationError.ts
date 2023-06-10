import mongoose from 'mongoose'
import { IGenericErrorMessage } from '../interfaces/error'
import { IGenericErrorResponse } from '../interfaces/common'

const handleValidationError = (
  err: mongoose.Error.ValidatorError
): IGenericErrorResponse => {
  const errors: IGenericErrorMessage[] = Object.values(err.errors).map(
    (el): IGenericErrorMessage => {
      return {
        path: el?.path,
        message: el?.message,
      }
    }
  )
  const statusCode = 400
  return {
    statusCode,
    message: 'Validation error',
    errorMessages: errors,
  }
}

export default handleValidationError
