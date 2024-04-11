import { Request, Response, Router } from 'express';
import { RequestWithBody } from '../models/common';
import { InputLoginModel } from '../models/login/input/input.login.model';
import { UserService } from '../services/user.service';
import { authValidation, codeValidation } from '../validators/auth.validators';
import {
   accessTokenGuard,
   refreshTokenGuard,
} from '../middlewares/auth/token.guards';
import { UserRepository } from '../repositories/user.repository';
import {
   emailResendValidation,
   registrationValidation,
} from '../validators/users.validators';
import { PostUserModel } from '../models/users/input/post.users.model';

import { AuthService, UserSessionData } from '../services/auth.service';
import { RefreshTokenBlackListRepository } from '../repositories/refresh.token.black.list.repository';
import { RefreshTokenBlackListDB } from '../models/common/email.confirmation/db/refresh.token.black.list';
import { ResultStatus } from '../common/enums/ResultToRouterStatus';
import { SessionRepository } from '../repositories/device.repository';
import { countApiRequestMiddleware } from '../middlewares/auth/count.api.requests.middleware';

export const authRoute: Router = Router({});

authRoute.post(
   '/login',
   countApiRequestMiddleware,
   authValidation(),
   async (req: RequestWithBody<InputLoginModel>, res: Response) => {
      console.log('/login');
      let userAgent = req.headers['user-agent'];
      if (!userAgent) {
         userAgent = 'unknown device';
      }
      let ip = req.ip;
      if (!ip) {
         ip = 'unknown ip';
      }
      const checkResult = await UserService.checkCredentials(
         req.body.loginOrEmail,
         req.body.password
      );

      if (!checkResult) {
         res.sendStatus(401);
         return;
      }

      const userId = await UserRepository.getUserIdByLoginOrEmail(
         req.body.loginOrEmail
      );
      if (!userId) {
         res.sendStatus(401);
         return;
      }
      const userData: UserSessionData = {
         userID: userId,
         deviceName: userAgent,
         ip: ip,
      };
      const accessAndRefreshTokens = await AuthService.createSession(userData);

      if (accessAndRefreshTokens.status === ResultStatus.SUCCESS) {
         const accessToken = {
            accessToken: accessAndRefreshTokens.data!.accessToken,
         };

         res.status(200)
            .cookie('refreshToken', accessAndRefreshTokens.data!.refreshToken, {
               httpOnly: true,
               secure: true,
            })
            .send(accessToken);

         return;
      }
      res.sendStatus(600);
   }
);

authRoute.get('/me', accessTokenGuard, async (req: Request, res: Response) => {
   const { email, login, userId } = req.user;
   const userObj = {
      email: email,
      login: login,
      userId: userId,
   };
   res.send(userObj).status(200);
});

authRoute.post(
   '/registration',
   countApiRequestMiddleware,
   registrationValidation(),
   async (req: RequestWithBody<PostUserModel>, res: Response) => {
      console.log('/registration');
      const newUserData = {
         login: req.body.login,
         password: req.body.password,
         email: req.body.email,
      };
      try {
         const result = await AuthService.userRegistration(newUserData);
         if (!result) {
            res.sendStatus(400);
            return;
         }
         res.sendStatus(204);
         return;
      } catch (error) {
         console.log(error);
         res.sendStatus(400);
         return;
      }
   }
);

authRoute.post(
   '/registration-confirmation',
   countApiRequestMiddleware,
   codeValidation(),
   async (req: RequestWithBody<{ code: string }>, res: Response) => {
      console.log('Received code ', req.body.code);
      try {
         // приходит код, проверяю, что он есть в базе, не протух и isConfirmed !== true, вношу подтверждение в isConfirmed
         const result = await AuthService.userRegistrationConfirmation(
            req.body.code
         );

         if (!result) {
            res.sendStatus(400);
            return;
         }
         res.sendStatus(204);
         return;
      } catch (error) {
         console.log(error);
         res.sendStatus(400);
         return;
      }
   }
);

authRoute.post(
   '/registration-email-resending',
   countApiRequestMiddleware,
   emailResendValidation(),
   async (req: RequestWithBody<{ email: string }>, res: Response) => {
      try {
         const result = await AuthService.userEmailResend(req.body.email);
         if (!result) {
            res.sendStatus(400);
            return;
         }
         res.sendStatus(204);
         return;
      } catch (error) {
         console.log(error);
         res.sendStatus(400);
      }
   }
);

authRoute.post(
   '/refresh-token',
   refreshTokenGuard,
   async (req: Request, res: Response) => {
      const token = req.cookies.refreshToken;
      const deviceID = req.user.deviceId;
      const refreshToken: RefreshTokenBlackListDB = { refreshToken: token };
      try {
         await RefreshTokenBlackListRepository.createInvalidRefreshToken(
            refreshToken
         );
         console.log('Device ID in router: ', deviceID);
         // const isSessionExist = await SessionRepository.findSessionById(
         //    deviceID!
         // );
         // if (!isSessionExist) {
         //    res.sendStatus(401);
         //    return;
         // }
         const tokens = await AuthService.refreshSession(
            deviceID!,
            req.user.userId
         );
         if (tokens.status === ResultStatus.SERVER_ERROR) {
            res.sendStatus(500);
            return;
         }
         if (tokens.status === ResultStatus.NOT_FOUND) {
            res.sendStatus(401);
            return;
         }

         const accessToken = {
            accessToken: tokens.data!.accessToken,
         };
         res.status(200)
            .cookie('refreshToken', tokens.data!.refreshToken, {
               httpOnly: true,
               secure: true,
            })
            .send(accessToken);

         return;
      } catch (error) {
         console.log(error);
         res.sendStatus(500);
      }
   }
);

// занести рефрештокен в блеклист

authRoute.post(
   '/logout',
   refreshTokenGuard,
   async (req: Request, res: Response) => {
      const token = req.cookies.refreshToken;
      const refreshToken: RefreshTokenBlackListDB = { refreshToken: token };
      const deviceID = req.user.deviceId;
      try {
         await RefreshTokenBlackListRepository.createInvalidRefreshToken(
            refreshToken
         );
         const isDelitedSession = await SessionRepository.deleteSessionById(
            deviceID!
         );
         if (!isDelitedSession) {
            res.sendStatus(401);
         }
         res.sendStatus(204);
         return;
      } catch (error) {
         console.log(error);
         res.sendStatus(500);
      }
   }
);

// новый логин = новый девайс
