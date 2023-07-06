import {
  IChangePassword,
  ILoginUser,
  IRefreshTokenResponse,
  IUserLoginResponse,
} from './auth.interface';
import { User } from '../user/user.model';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { IUser } from '../user/user.interface';
import { JwtPayload, Secret } from 'jsonwebtoken';
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

const createRefreshToken = async (
  token: string
): Promise<IRefreshTokenResponse> => {
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelper.verifyToken(
      token,
      config.jwt.jwt_refresh_secret as Secret
    );
  } catch (e) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid refresh token.');
  }
  const { id } = verifiedToken;

  const user = new User();
  const isUserExist = await user.isUserExist(id);
  if (!isUserExist)
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist.');

  const newAccessToken: string = jwtHelper.createToken(
    {
      id: isUserExist?.id,
      role: isUserExist?.role,
    },
    config.jwt.jwt_secret as Secret,
    { expiresIn: config.jwt.jwt_expired_time }
  );

  return { accessToken: newAccessToken };
};

const changePassword = async (
  payload: IChangePassword,
  userObj: JwtPayload | null
): Promise<void> => {
  const { oldPassword, newPassword } = payload;

  const isUserExist = await User.findOne({ id: userObj?.id }).select(
    '+password'
  );

  if (!isUserExist)
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found !');

  // match password
  const user = new User();
  if (!(await user.isPasswordMatched(oldPassword, isUserExist.password)))
    throw new ApiError(httpStatus.UNAUTHORIZED, 'ID or password is incorrect.');

  isUserExist.password = newPassword;
  isUserExist.needToChangePassword = false;
  isUserExist.save();
};

export const AuthService = {
  loginUser,
  createRefreshToken,
  changePassword,
};
