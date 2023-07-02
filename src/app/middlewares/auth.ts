import { NextFunction, Request, Response } from 'express';
import ApiError from '../../errors/ApiError';
import httpStatus from 'http-status';
import { jwtHelper } from '../../helpers/jwtHelper';
import { Secret } from 'jsonwebtoken';
import config from '../../config';

const auth =
  (...requiredRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    // receiving all the values through rest operator
    try {
      const token: string | undefined = req.headers.authorization;
      if (!token)
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          'You are not authorized to perform this action.'
        );

      let verifiedUser = null;
      verifiedUser = jwtHelper.verifyToken(
        token,
        config.jwt.jwt_secret as Secret
      );

      req.user = verifiedUser;

      if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role))
        throw new ApiError(
          httpStatus.FORBIDDEN,
          'Forbidden. You are not authorized to perform this action.'
        );

      next();
    } catch (error) {
      next(error);
    }
  };

export default auth;
