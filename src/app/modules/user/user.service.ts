import { IUser } from './user.interface';
import { User } from './user.model';
import { generateUserId } from './user.utils';
import ApiError from '../../../errors/ApiError';

const createUserIntoDb = async (user: IUser): Promise<IUser | null> => {
  // auto incremental id
  user.id = await generateUserId();

  // default password
  // if (!user.password) user.password = config.default_user_password as string // type alias

  const createdUser = await User.create(user);
  if (!createdUser) throw new ApiError(400, 'Failed to create user.');
  return createdUser;
};

const findLastUserId = async () => {
  const lastUser = await User.findOne({}, { id: 1, _id: 0 })
    .sort({
      createdAt: -1,
    })
    .lean();
  return lastUser?.id;
};

export const UserService = {
  createUserIntoDb,
  findLastUserId,
};
