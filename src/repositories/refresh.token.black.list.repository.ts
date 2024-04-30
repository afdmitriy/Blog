import { RefreshTokenBlackListModelClass } from '../db/db';
import { RefreshTokenBlackListDB } from '../models/common/email.confirmation/db/refresh.token.black.list';

export class RefreshTokenBlackListRepository {
   static async createInvalidRefreshToken(
      token: RefreshTokenBlackListDB
   ): Promise<boolean> {
      try {
         const createdToken = await RefreshTokenBlackListModelClass.create(
            token
         );

         return !!createdToken._id;
      } catch (error) {
         console.log(error);
         return false;
      }
   }

   static async findInvalidRefreshToken(
      token: string
   ): Promise<RefreshTokenBlackListDB | null> {
      const resToken = await RefreshTokenBlackListModelClass.findOne({
         refreshToken: token,
      }).lean();
      return resToken;
   }
}
