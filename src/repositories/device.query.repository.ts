import { userSessionsCollection } from '../db/db';

export class SessionQueryRepository {
   static async getSessionsByUserId(userID: string) {
      const currentDate = new Date();
      const sessions = await userSessionsCollection
         .find({ userID: userID, expirationDate: { $gte: currentDate } })
         .toArray();
      if (!sessions) return null;

      const updatedSessions = sessions.map((session) => {
         return {
            ...session,
            _id: session._id.toString(),
         };
      });
      return updatedSessions;
   }
}
