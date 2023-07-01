import jwt, { Secret } from 'jsonwebtoken';

const createToken = (
  payload: object,
  secret: Secret,
  options: object
): string => {
  return jwt.sign(payload, secret, options);
};

export const jwtHelper = {
  createToken,
};
