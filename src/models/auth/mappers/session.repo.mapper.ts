import { WithId } from 'mongodb';
import { UserSessionsDB } from '../db/user.sessions.type';
import { UserSessionOutputType } from '../output/user.session.output.model';

export const sessionMapper = (
   session: WithId<UserSessionsDB>
): UserSessionOutputType => {
   return {
      sessionID: session._id.toString(),
      userID: session.userID,
      issuedAt: session.issuedAt.toISOString(),
      deviceName: session.deviceName,
      ip: session.ip,
      expirationDate: session.expirationDate.toISOString(),
   };
};
