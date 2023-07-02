import jwt, { JwtPayload, Secret } from 'jsonwebtoken';

const createToken = (
  payload: object,
  secret: Secret,
  options: object
): string => {
  return jwt.sign(payload, secret, options);
};

const verifyToken = (token: string, refreshTokenSecret: Secret): JwtPayload => {
  return jwt.verify(token, refreshTokenSecret) as JwtPayload;
};

export const jwtHelper = {
  createToken,
  verifyToken,
};
