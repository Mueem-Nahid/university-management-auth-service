import { ILoginUser, IUserLoginResponse } from './auth.interface';
import { User } from '../user/user.model';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { IUser } from '../user/user.interface';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import { jwtHelper } from '../../../helpers/jwtHelper';

const loginUser = async (payload: ILoginUser): Promise<IUserLoginResponse> => {
  const { id, password } = payload;

  const user = new User();
  const isUserExist: Pick<
    IUser,
    'id' | 'password' | 'role' | 'needToChangePassword'
  > | null = await user.isUserExist(id);
  if (!isUserExist)
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found !');

  // match password
  if (!(await user.isPasswordMatched(password, isUserExist.password)))
    throw new ApiError(httpStatus.UNAUTHORIZED, 'ID or password is incorrect.');

  // create access and refresh token
  const accessToken: string = jwtHelper.createToken(
    {
      id: isUserExist?.id,
      role: isUserExist?.role,
    },
    config.jwt.jwt_secret as Secret,
    { expiresIn: config.jwt.jwt_expired_time }
  );

  const refreshToken: string = jwtHelper.createToken(
    {
      id: isUserExist?.id,
      role: isUserExist?.role,
    },
    config.jwt.jwt_refresh_secret as Secret,
    { expiresIn: config.jwt.jwt_refresh_token_expired_time }
  );

  return {
    accessToken,
    refreshToken,
    needToChangePassword: isUserExist.needToChangePassword,
  };
};

export const AuthService = {
  loginUser,
};
