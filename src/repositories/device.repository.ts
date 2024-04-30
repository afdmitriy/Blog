import { SessionModelClass } from '../db/db';
import { UserSessionsDB } from '../models/auth/db/user.sessions.type';
import { ObjectId } from 'mongodb';
import { sessionMapper } from '../models/auth/mappers/session.repo.mapper';
import { UserSessionOutputType } from '../models/auth/output/user.session.output.model';
import { RefreshDataType } from '../services/auth.service';

export class SessionRepository {
   static async createSession(
      sessionData: UserSessionsDB
   ): Promise<string | false> {
      try {
         const createdSession = await SessionModelClass.create(
            sessionData
         );
         if (!createdSession._id) {
            return false;
         }
         return createdSession._id.toString();
      } catch (error) {
         console.log(error);
         return false;
      }
   }

   static async findSessionById(
      sessionId: string
   ): Promise<UserSessionOutputType | null> {
      const session = await SessionModelClass.findOne({
         _id: sessionId,
      }).lean();
      if (!session) {
         return null;
      }
      return sessionMapper(session);
   }

   static async deleteSessionById(sessionId: string) {
      try {
         const res = await SessionModelClass.deleteOne({
            _id: sessionId,
         });

         return !!res.deletedCount;
      } catch (error) {
         return false;
      }
   }

   static async deleteSessionsExcludeId(sessionId: string) {
      try {
         const currentSession = await this.findSessionById(sessionId);
         if (!currentSession) {
            throw new Error('Session not found');
         }
         const isDeleted = await SessionModelClass.deleteMany({
            userID: currentSession.userID,
            _id: { $ne: currentSession.sessionID }, // Исключаем текущую сессию из удаления
         });
         return !!isDeleted.deletedCount;
      } catch (error) {
         console.log(error);
         return;
      }
   }

   static async updateSessionLiveTime(data: RefreshDataType) {
      try {
         const res = await SessionModelClass.updateOne(
            { _id: data.deviceID },
            {
               $set: {
                  issuedAt: data.dateNow,
                  expirationDate: data.expirationDate,
               },
            }
         );

         return !!res.matchedCount;
      } catch (error) {
         console.log(error);
         return false;
      }
   }
}
