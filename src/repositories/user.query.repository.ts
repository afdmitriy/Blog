import { ObjectId } from 'mongodb';
import { userMapper } from '../models/users/mappers/user.mapper';
import { UserModelClass} from '../db/db';
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

      let filter: any = {};

      if (searchLoginTerm) {
         filter.login = {
               $regex: searchLoginTerm,
               $options: 'i',
            }
      }

      if (searchEmailTerm) {
         filter.email = {
               $regex: searchEmailTerm,
               $options: 'i',
            }
      }


      try {
         const users = await UserModelClass
            .find(filter)
            .sort({[sortBy]: sortDirection})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize).lean()
            

         const totalCount = await UserModelClass.countDocuments(filter);
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
         const user = await UserModelClass.findOne({ _id: id }).lean();
         
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
