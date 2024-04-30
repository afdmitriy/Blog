import { SessionModelClass} from '../db/db';

export class SessionQueryRepository {
   static async getSessionsByUserId(userID: string) {
      const currentDate = new Date();
      const sessions = await SessionModelClass
         .find({ userID: userID}).lean()
         .exec();
      if (!sessions) return null;

      const updatedSessions = sessions.map((session: any) => {
         return {
            ...session,
            _id: session._id.toString(),
         };
      });
      return updatedSessions;
   }
}
