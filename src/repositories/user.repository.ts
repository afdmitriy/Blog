import { ObjectId } from 'mongodb';
import { UserModelClass } from '../db/db';
import { UsersDB } from '../models/users/db/users.db';
import { OutputUserType } from '../models/users/output/output.user.type';
import { userMapper } from '../models/users/mappers/user.mapper';

type PostUserModelWithSalt = {
   login: string;
   passwordHash: string;
   passwordSalt: string;
   email: string;
   createdAt: string;
};

export class UserRepository {
   static async createUser(
      userData: PostUserModelWithSalt
   ): Promise<OutputUserType | null | false> {
      try {
         const createdUser = await UserModelClass.create(userData);
         console.log(createdUser, createdUser._id.toString());
      
         const user = await UserModelClass.findOne({ _id: createdUser._id }).lean()
         console.log(user);
         if (!user) {
            return null;
         }

         return userMapper(user);;
      } catch (error) {
         console.log(error);
         return false;
      }
   }
   static async findUserById(id: string): Promise<OutputUserType | null> {
      const user = await UserModelClass.findOne({ _id: id }).lean();
      if (!user) {
         return null;
      }
      return userMapper(user);
   }
   static async deleteUserById(id: string): Promise<boolean> {
      try {
         const res = await UserModelClass.deleteOne({ _id: id });

         return !!res.deletedCount;
      } catch (error) {
         console.log(error);
         return false;
      }
   }

   static async findUserByLoginOrEmail(
      loginOrEmail: string
   ): Promise<UsersDB | null> {
      const user = await UserModelClass.findOne({
         $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
      }).lean();
      return user;
   }

   static async getUserIdByLoginOrEmail(
      loginOrEmail: string
   ): Promise<string | null | false> {
      try {
         const user = await UserModelClass.findOne({
            $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
         }).lean();
         if (!user) {
            return null;
         }
         return user._id.toString();
      } catch (error) {
         console.log(error);
         return false;
      }
   }

   static async updateUserPassword(
      id: string,
      newPasswordHash: string,
      newPasswordSalt: string
   ): Promise<boolean> {
      try {
         const res = await UserModelClass.updateOne(
            { _id: id },
            {
               $set: {
                  passwordHash: newPasswordHash,
                  passwordSalt: newPasswordSalt,
               },
            }
         );
         return !!res.matchedCount
      } catch (error) {
         console.log(error);
         return false;
      }
   }

   static async findUserLoginsByIds(ids: string[]): Promise<{
      userId: string;
      login: string;
   }[]> {

         const users = await UserModelClass.find({ _id: { $in: ids } }).lean();
         if (users.length === 0) return [];
         const logins = users.map((user) =>  ({
            userId: user._id.toString(),
            login: user.login
         }));
         return logins;
   }



   // static async doesUserExistById(id: string) {
   //    try {
   //       const user = await usersCollection.findOne({ _id: new ObjectId(id) });

   //       if (!user) {
   //          return null;
   //       }
   //       return true;
   //    } catch (error) {
   //       console.log(error);
   //       return false;
   //    }
   // }
}
