import { NextFunction, Request, Response } from 'express';
import { JWTService } from '../../application/jwt.service';
import { UserQueryRepository } from '../../repositories/user.query.repository';

export const accessTokenGuard = async (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   try {
      if (!req.headers.authorization) {
         res.sendStatus(401);
         return;
      }

      const token = req.headers.authorization.split(' ')[1]; //'bearer 42667fhr747ygfy56r7' отделяем от bearer

      const payload = await JWTService.verifyToken(token);

      if (payload && typeof payload === 'object' && 'userId' in payload) {
         const { userId } = payload;
         const user = await UserQueryRepository.getUserById(userId);
         if (!user) {
            res.sendStatus(401);
            return;
         }

         req.user = { userId: user.id, login: user.login, email: user.email };
         next();
         return;
      }

      res.sendStatus(401);
      return;
   } catch (error) {
      console.log(error);
      res.sendStatus(500);
   }
};
