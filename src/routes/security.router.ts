import { Request, Response, Router } from 'express';
import { refreshTokenGuard } from '../middlewares/auth/token.guards';
import { SecurityService } from '../services/security.service';
import { SessionRepository } from '../repositories/device.repository';
import { RequestWithParams, RequestWithQuery } from '../models/common';
import { ResultStatus } from '../common/enums/ResultToRouterStatus';

export const securityRoute: Router = Router({});

securityRoute.get(
   '/devices',
   refreshTokenGuard,
   async (req: Request, res: Response) => {
      const deviceId = req.user.deviceId;
      try {
         const devices = await SecurityService.getUserDevicesBySessionId(
            deviceId!
         );
         if (devices.status === ResultStatus.SUCCESS && devices.data) {
            res.status(200).send(devices.data);
         } else if (devices.status === ResultStatus.NOT_FOUND) {
            res.status(404);
            return;
         }
      } catch (error) {
         console.log(error);
         res.sendStatus(500);
      }
   }
);

// засунуть рТокены в блеклисты
securityRoute.delete(
   '/devices',
   refreshTokenGuard,
   async (req: Request, res: Response) => {
      try {
         const deviceIdId = req.user.deviceId;
         const isDeleted = await SessionRepository.deleteSessionsExcludeId(
            deviceIdId!
         );
         if (!isDeleted) {
            res.sendStatus(500);
            return;
         }
         res.sendStatus(204);
      } catch (error) {
         console.log(error);
         res.sendStatus(500);
         return;
      }
   }
);

securityRoute.delete(
   '/devices/:deviceId',
   refreshTokenGuard,
   async (req: RequestWithParams<{ deviceId: string }>, res: Response) => {
      const userId = req.user.userId;
      const queryDeviceId = req.params.deviceId;

      try {
         const isDeleted = await SecurityService.terminateUserDeviceSession(
            queryDeviceId,
            userId
         );
         if (isDeleted.status === ResultStatus.FORBIDDEN) {
            res.sendStatus(403);
            return;
         } else if (isDeleted.status === ResultStatus.NOT_FOUND) {
            res.sendStatus(404);
            return;
         } else if (isDeleted.status === ResultStatus.SUCCESS) {
            res.sendStatus(204);
            return;
         } else {
            res.sendStatus(500);
            return;
         }
      } catch (error) {
         console.log(error);
         res.sendStatus(500);
         return;
      }
   }
);
