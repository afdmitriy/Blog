import { ResultStatus } from '../common/enums/ResultToRouterStatus';
import { SessionQueryRepository } from '../repositories/device.query.repository';
import { SessionRepository } from '../repositories/device.repository';

export class SecurityService {
   static async getUserDevicesBySessionId(sessionId: string) {
      const session = await SessionRepository.findSessionById(sessionId);
      if (!session)
         return {
            data: null,
            errorMessage: 'Device not found',
            status: ResultStatus.NOT_FOUND,
         };

      const devices = await SessionQueryRepository.getSessionsByUserId(
         session.userID
      );
      if (!devices)
         return {
            data: null,
            errorMessage: 'Sessions not found',
            status: ResultStatus.NOT_FOUND,
         };
      const validDevices = devices
         // .filter((device) => {
         //    const isNotExpired = checkExpirationDate(device.expirationDate);
         //    return isNotExpired;
         // })
         .map((device) => {
            return {
               deviceId: device._id,
               ip: device.ip,
               lastActiveDate: device.issuedAt.toISOString(),
               title: device.deviceName,
            };
         });
      return {
         data: validDevices,
         status: ResultStatus.SUCCESS,
      };
   }

   static async terminateUserDeviceSession(deviceId: string, userId: string) {
      const session = await SessionRepository.findSessionById(deviceId);
      if (!session) {
         return {
            data: null,
            errorMessage: 'Device session is not found',
            status: ResultStatus.NOT_FOUND,
         };
      }
      if (session.userID !== userId)
         return {
            data: null,
            errorMessage: 'This user not have access to this device',
            status: ResultStatus.FORBIDDEN,
         };

      const isDeleted = await SessionRepository.deleteSessionById(deviceId);
      if (!isDeleted)
         return {
            data: null,
            errorMessage: 'Server error',
            status: ResultStatus.SERVER_ERROR,
         };

      return {
         data: null,
         status: ResultStatus.SUCCESS,
      };
   }
}
