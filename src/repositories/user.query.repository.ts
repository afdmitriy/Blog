import { ObjectId } from 'mongodb';
import { userMapper } from '../models/users/mappers/user.mapper';
import { usersCollection } from '../db/db';
import { OutputUserType } from '../models/users/output/output.user.type';
import { OutputUsersWithQuery } from '../models/users/output/output.users.query.type';

type SortData = {
   searchLoginTerm: string | null;
   searchEmailTerm: string | null;
   sortBy: string;
   sortDirection: 'desc' | 'asc';
   pageNumber: number;
   pageSize: number;
};

export class UserQueryRepository {
   static async getAllUsers(
      sortData: SortData
   ): Promise<OutputUsersWithQuery | false> {
      const {
         sortDirection,
         sortBy,
         pageNumber,
         pageSize,
         searchEmailTerm,
         searchLoginTerm,
      } = sortData;

      let filter: any = [];

      if (searchLoginTerm) {
         filter.push({
            login: {
               $regex: searchLoginTerm,
               $options: 'i',
            },
         });
      }

      if (searchEmailTerm) {
         filter.push({
            email: {
               $regex: searchEmailTerm,
               $options: 'i',
            },
         });
      }

      // Если ни одно из условий не задано, ищем все документы
      if (filter.length === 0) {
         filter = [{}];
      }
      try {
         const users = await usersCollection
            .find({ $or: filter })
            .sort(sortBy, sortDirection)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray();

         const totalCount = await usersCollection.countDocuments({
            $or: filter,
         });
         const pagesCount = Math.ceil(totalCount / pageSize);

         return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: users.map(userMapper),
         };
      } catch (error) {
         console.log(error);
         return false;
      }
   }

   static async getUserById(
      id: string
   ): Promise<OutputUserType | null | false> {
      try {
         const user = await usersCollection.findOne({ _id: new ObjectId(id) });

         if (!user) {
            return null;
         }
         return userMapper(user);
      } catch (error) {
         console.log(error);
         return false;
      }
   }
}
