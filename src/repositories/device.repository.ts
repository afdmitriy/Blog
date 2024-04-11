import { userSessionsCollection } from '../db/db';
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
         const createdSession = await userSessionsCollection.insertOne(
            sessionData
         );
         if (!createdSession.insertedId) {
            return false;
         }
         return createdSession.insertedId.toString();
      } catch (error) {
         console.log(error);
         return false;
      }
   }

   static async findSessionById(
      sessionId: string
   ): Promise<UserSessionOutputType | null> {
      const session = await userSessionsCollection.findOne({
         _id: new ObjectId(sessionId),
      });
      if (!session) {
         return null;
      }
      return sessionMapper(session);
   }

   static async deleteSessionById(sessionId: string) {
      try {
         const res = await userSessionsCollection.deleteOne({
            _id: new ObjectId(sessionId),
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
         const isDeleted = await userSessionsCollection.deleteMany({
            userID: currentSession.userID,
            _id: { $ne: new ObjectId(currentSession.sessionID) }, // Исключаем текущую сессию из удаления
         });
         return !!isDeleted.deletedCount;
      } catch (error) {
         console.log(error);
         return;
      }
   }

   static async updateSessionLiveTime(data: RefreshDataType) {
      try {
         const res = await userSessionsCollection.updateOne(
            { _id: new ObjectId(data.deviceID) },
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
