import { JWTService } from '../adapters/jwt.service';
import { ResultStatus } from '../common/enums/ResultToRouterStatus';
import { ResultStatusType } from '../common/types/result.status.type';
import { PostUserModel } from '../models/users/input/post.users.model';
import { SessionRepository } from '../repositories/device.repository';
import { EmailConfirmationRepository } from '../repositories/email.confirmation.repository';
import { RefreshTokenBlackListRepository } from '../repositories/refresh.token.black.list.repository';
import { UserQueryRepository } from '../repositories/user.query.repository';
import { UserRepository } from '../repositories/user.repository';
import { EmailConfirmationService } from './email.confirmation.service';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import { UserService } from './user.service';

dotenv.config();

export const RefreshTokenLiveTime =
   process.env.REFRESH_TOKEN_LIVE_TIME || 'str';

export type UserSessionData = {
   userID: string;
   deviceName: string;
   ip: string;
};

export type RefreshDataType = {
   deviceID: string;
   dateNow: Date;
   expirationDate: Date;
};

export class AuthService {
   static async userRegistration(userData: PostUserModel): Promise<boolean> {
      const token = uuidv4();
      try {
         const newUser = await UserService.createUser(userData);
         if (!newUser) {
            return false;
         }
         const isCreate = await EmailConfirmationService.createConfirmationData(
            newUser.id,
            token
         );
         if (!isCreate) {
            console.log('Error: authService.userRegistration, isCreate');
            return false;
         }
         // const user = await UserRepository.getUserIdByLoginOrEmail(
         //    userData.login
         // );
         // if (!user) {
         //    return false;
         // }
         const userConfirmationData =
            await EmailConfirmationRepository.findEmailConfirmationDataByUserId(
               newUser.id
            );
         if (!userConfirmationData) {
            return false;
         }
         EmailConfirmationService.sendConfirmationMail(
            userConfirmationData.confirmationCode,
            userData.email
         );
         return true;
      } catch (error) {
         console.log(error);
         return false;
      }
   }

   static async userRegistrationConfirmation(
      confirmationCode: string
   ): Promise<boolean> {
      // приходит код, проверяю, что он есть в базе, не протух и isConfirmed это false, вношу подтверждение в isConfirmed
      try {
         const emailConfirmationData =
            await EmailConfirmationRepository.findConfirmationDataByConfirmCode(
               confirmationCode
            );
         if (!emailConfirmationData) {
            return false;
         }
         if (emailConfirmationData.expirationDate < new Date()) {
            return false;
         }
         if (emailConfirmationData.isConfirmed != false) {
            return false;
         }
         const res = await EmailConfirmationRepository.confirmEmail(
            emailConfirmationData.id
         );
         if (!res) {
            return false;
         }
         return true;
      } catch (error) {
         console.log(error);
         return false;
      }
   }

   static async userEmailResend(email: string): Promise<boolean> {
      const token = uuidv4();
      console.log('Resending code ', token);
      try {
         const userID = await UserRepository.getUserIdByLoginOrEmail(email);
         if (!userID) return false;
         const emailData =
            await EmailConfirmationRepository.findEmailConfirmationDataByUserId(
               userID
            );
         if (!emailData || emailData.isConfirmed === true) return false;
         // Обновить confirmationCode
         await EmailConfirmationRepository.updateConfirmationCode(
            token,
            userID
         );
         await EmailConfirmationService.sendConfirmationMail(token, email);
         console.log('Mail must be resend');
         return true;
      } catch (error) {
         console.log(error);
         return false;
      }
   }

   static async checkAccessToken(authHeader: string) {
      const auth = authHeader.split(' ');
      if (auth[0] !== 'Bearer')
         return {
            data: null,
            errorMessage: 'Wrong authorization method',
            status: ResultStatus.UNAUTHORIZED,
         };

      const payload: any = await JWTService.verifyToken(auth[1]); // Как типизировать чтобы избавиться от any?

      if (!payload || typeof payload !== 'object')
         return {
            data: null,
            errorMessage: 'Wrong access token',
            status: ResultStatus.UNAUTHORIZED,
         };

      const { userId } = payload;
      const user = await UserQueryRepository.getUserById(userId);
      if (!user)
         return {
            data: null,
            errorMessage: 'User not found',
            status: ResultStatus.UNAUTHORIZED,
         };

      return {
         data: { userId: user.id, login: user.login, email: user.email },
         status: ResultStatus.SUCCESS,
      };
   }

   static async createRefreshAndAccessTokens(userId: string, deviceId: string) {
      const accessToken = await JWTService.createJWT(userId);
      const refreshToken = await JWTService.createRefreshJWT(userId, deviceId);

      return {
         accessToken: accessToken,
         refreshToken: refreshToken,
      };
   }

   static async checkRefreshToken(token: string): Promise<
      ResultStatusType<{
         userId: string;
         login: string;
         email: string;
         deviceId: string;
      }>
   > {
      const result =
         await RefreshTokenBlackListRepository.findInvalidRefreshToken(token);
      if (result)
         return {
            data: null,
            errorMessage: 'Token has expired',
            status: ResultStatus.UNAUTHORIZED,
         };

      const payload: any = await JWTService.verifyToken(token); // Как типизировать чтобы избавиться от any?

      if (!payload || typeof payload !== 'object')
         return {
            data: null,
            errorMessage: 'Wrong access token',
            status: ResultStatus.UNAUTHORIZED,
         };

      const { userId } = payload;
      const user = await UserQueryRepository.getUserById(userId);
      if (!user)
         return {
            data: null,
            errorMessage: 'User not found',
            status: ResultStatus.UNAUTHORIZED,
         };

      return {
         data: {
            userId: user.id,
            login: user.login,
            email: user.email,
            deviceId: payload.deviceId,
         },
         status: ResultStatus.SUCCESS,
      };
   }


   static async createSession(userSessionData: UserSessionData): Promise<
      ResultStatusType<{
         accessToken: string;
         refreshToken: string;
      }>
   > {
      const data = {
         ...userSessionData,
         issuedAt: new Date(),
         expirationDate: new Date(Date.now() + Number(RefreshTokenLiveTime)),
      };
      const sessionDataId = await SessionRepository.createSession(data);
      if (!sessionDataId)
         return {
            data: null,
            errorMessage:
               'Error while create session in data layer or  DB is down',
            status: ResultStatus.SERVER_ERROR,
         };
      const tokens = await this.createRefreshAndAccessTokens(
         userSessionData.userID,
         sessionDataId
      );
      return {
         data: tokens,
         status: ResultStatus.SUCCESS,
      };
   }

   static async refreshSession(
      deviceID: string,
      userID: string
   ): Promise<
      ResultStatusType<{
         accessToken: string;
         refreshToken: string;
      }>
   > {
      const tokens = await this.createRefreshAndAccessTokens(userID, deviceID);

      const oldSessionData = await SessionRepository.findSessionById(deviceID);
      if (!oldSessionData)
         return {
            data: null,
            errorMessage: 'Session not found',
            status: ResultStatus.NOT_FOUND,
         };
      const dateNow = new Date();
      const expirationDate = new Date(Date.now() + RefreshTokenLiveTime);
      const data: RefreshDataType = {
         deviceID: deviceID,
         dateNow: dateNow,
         expirationDate: expirationDate,
      };
      const updatedSession = await SessionRepository.updateSessionLiveTime(
         data
      );
      if (!updatedSession) {
         return {
            data: null,
            errorMessage:
               'Error while update session in data layer or  DB is down',
            status: ResultStatus.SERVER_ERROR,
         };
      }
      return {
         data: tokens,
         status: ResultStatus.SUCCESS,
      };
   }

   static async userPasswordRecovery(email: string): Promise<
   ResultStatusType<boolean | null>
> {
      const token = uuidv4();
      try {
         const userId = await UserRepository.getUserIdByLoginOrEmail(email);
         if (!userId) return {
            data: null,
            errorMessage: 'User not found',
            status: ResultStatus.NOT_FOUND,
         };
         const confirmData = await EmailConfirmationService.createConfirmationData( userId, token );
            
         await EmailConfirmationService.sendPasswordRecoveryMail(token, email);
         return {
            data: null,
            status: ResultStatus.SUCCESS,
         };
      } catch (error) {
         console.log(error);
         return {
            data: null,
            errorMessage: 'Server Error',
            status: ResultStatus.SERVER_ERROR,
         }
      }

   }

   static async setNewUserPassword(recoveryCode: string, newPassword: string): Promise<
   ResultStatusType<boolean | null>
> {
      try {
         const confirmData = await EmailConfirmationRepository.findConfirmationDataByConfirmCode(recoveryCode);
         if (!confirmData) return {
            data: null, 
            errorMessage: 'Confirmation code not found',
            status: ResultStatus.NOT_FOUND
         }
         const userId = confirmData.userID;
         const result = await UserService.setNewUserPassword(userId, newPassword);
         return {
            data: result,
            status: ResultStatus.SUCCESS
         }
      } catch (error) {
         console.log(error);
         return {
            data: null,
            errorMessage: 'Server Error',
            status: ResultStatus.SERVER_ERROR,
         }
      }
   }

   
}
