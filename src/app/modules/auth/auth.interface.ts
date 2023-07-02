export type ILoginUser = {
  id: string;
  password: string;
};

export type IUserLoginResponse = {
  accessToken: string;
  refreshToken?: string;
  needToChangePassword: boolean;
};

export type IRefreshTokenResponse = {
  accessToken: string;
};
