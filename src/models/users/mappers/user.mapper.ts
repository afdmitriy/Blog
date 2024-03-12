import { WithId } from 'mongodb';
import { UsersDB } from '../db/users.db';
import { OutputUserType } from '../output/output.user.type';

export const userMapper = (user: WithId<UsersDB>): OutputUserType => {
   return {
      id: user._id.toString(),
      login: user.login,
      email: user.email,
      createdAt: user.createdAt,
   };
};
