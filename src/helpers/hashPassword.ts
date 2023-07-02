import config from '../config';
import bcrypt from 'bcrypt';

const encryptPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, Number(config.bcrypt_salt_rounds));
};

const decryptPassword = async (
  enteredPassword: string,
  password: string
): Promise<boolean> => {
  return await bcrypt.compare(enteredPassword, password);
};

export const hashPassword = { encryptPassword, decryptPassword };
