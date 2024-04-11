import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { RefreshTokenLiveTime } from '../services/auth.service';

dotenv.config();

const secretKey = process.env.SECRET_KEY || 'YOURSECRETKEYGOESHERE';

export class JWTService {
   static async createJWT(userId: string): Promise<string> {
      const token = jwt.sign({ userId }, secretKey, {
         expiresIn: 10,
      });
      return token;
   }

   static async decodeToken(token: string) {
      try {
         return jwt.decode(token);
      } catch (error) {
         console.log("Can't decode token");
         return null;
      }
   }

   static async verifyToken(token: string) {
      try {
         return jwt.verify(token, secretKey);
      } catch (error) {
         console.log("Can't verify token");
         return null;
      }
   }

   static async getUserIdByToken(token: string) {
      try {
         const result: any = jwt.verify(token, secretKey); //Как избавиться от any?
         return result.userId;
      } catch (error) {
         console.log(error);
         return null;
      }
   }

   static async createRefreshJWT(
      userId: string,
      deviceId: string
   ): Promise<string> {
      const token = jwt.sign({ userId, deviceId }, secretKey, {
         expiresIn: RefreshTokenLiveTime,
      });
      return token;
   }
}
