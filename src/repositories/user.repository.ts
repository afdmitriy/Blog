import { ObjectId, WithId } from 'mongodb';
import { usersCollection } from '../db/db';
import { UsersDB } from '../models/users/db/users.db';
import { UserQueryRepository } from './user.query.repository';
import { OutputUserType } from '../models/users/output/output.user.type';

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
         const createdUser = await usersCollection.insertOne(userData);

         const user = await UserQueryRepository.getUserById(
            createdUser.insertedId.toString()
         );

         if (!user) {
            return null;
         }

         return user;
      } catch (error) {
         console.log(error);
         return false;
      }
   }

   static async deleteUserById(id: string): Promise<boolean> {
      try {
         const res = await usersCollection.deleteOne({ _id: new ObjectId(id) });

         return !!res.deletedCount;
      } catch (error) {
         console.log(error);
         return false;
      }
   }

   static async findUserByLoginOrEmail(
      loginOrEmail: string
   ): Promise<UsersDB | null> {
      const user = await usersCollection.findOne({
         $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
      });
      return user;
   }

   static async getUserIdByLoginOrEmail(
      loginOrEmail: string
   ): Promise<string | null | undefined> {
      try {
         const user = await usersCollection.findOne({
            $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
         });

         return user?._id.toString();
      } catch (error) {
         console.log(error);
         return null;
      }
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
