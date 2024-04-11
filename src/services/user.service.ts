import { UsersDB } from '../models/users/db/users.db';
import { GetUserQueryModel } from '../models/users/input/get.users.query.model';
import { PostUserModel } from '../models/users/input/post.users.model';
import { OutputUserType } from '../models/users/output/output.user.type';
import { OutputUsersWithQuery } from '../models/users/output/output.users.query.type';
import { UserQueryRepository } from '../repositories/user.query.repository';
import { UserRepository } from '../repositories/user.repository';
import bcrypt from 'bcrypt';

type UserParams = {
   searchLoginTerm: string | null;
   searchEmailTerm: string | null;
   sortBy: string;
   sortDirection: 'desc' | 'asc';
   pageNumber: number;
   pageSize: number;
};

export class UserService {
   static async getAllUsers(
      queryParams: GetUserQueryModel
   ): Promise<OutputUsersWithQuery | false | null> {
      const userParams: UserParams = {
         searchLoginTerm: queryParams.searchLoginTerm ?? null,
         searchEmailTerm: queryParams.searchEmailTerm ?? null,
         sortBy: queryParams.sortBy ?? 'createdAt',
         sortDirection: queryParams.sortDirection ?? 'desc',
         pageNumber: queryParams.pageNumber ? +queryParams.pageNumber : 1,
         pageSize: queryParams.pageSize ? +queryParams.pageSize : 10,
      };

      try {
         const users = await UserQueryRepository.getAllUsers(userParams);

         if (!users) {
            return null;
         }

         return users;
      } catch (error) {
         console.log(error);
         return false;
      }
   }

   static async createUser(
      userData: PostUserModel
   ): Promise<OutputUserType | false | null> {
      const passwordSalt = await bcrypt.genSalt(10);
      const passwordHash = await this._generateHash(
         userData.password,
         passwordSalt
      );

      const newUser: UsersDB = {
         login: userData.login,
         email: userData.email,
         createdAt: new Date().toISOString(),
         passwordHash: passwordHash,
         passwordSalt: passwordSalt,
      };

      const user = await UserRepository.createUser(newUser);

      if (!user) {
         return null;
      }

      return user;
   }

   static async _generateHash(password: string, salt: string) {
      const hash = await bcrypt.hash(password, salt);
      return hash;
   }

   static async checkCredentials(loginOrEmail: string, password: string) {
      const user = await UserRepository.findUserByLoginOrEmail(loginOrEmail);
      if (!user) return false;

      const passwordHash = await this._generateHash(
         password,
         user.passwordSalt
      );

      if (passwordHash !== user.passwordHash) {
         return false;
      }

      return true;
   }
}
