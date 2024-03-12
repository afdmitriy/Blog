import { Request, Response, Router } from 'express';
import { RequestWithBody } from '../models/common';
import { InputLoginModel } from '../models/login/input/input.login.model';
import { UserService } from '../services/user.service';
import { authValidation } from '../validators/auth.validators';
import { accessTokenGuard } from '../middlewares/auth/accessTokenGuard';
import { JWTService } from '../application/jwt.service';
import { UserRepository } from '../repositories/user.repository';

export const authRoute: Router = Router({});

authRoute.post(
   '/login',
   authValidation(),
   async (req: RequestWithBody<InputLoginModel>, res: Response) => {
      const checkResult = await UserService.checkCredentials(
         req.body.loginOrEmail,
         req.body.password
      );

      if (checkResult) {
         const userId = await UserRepository.getUserIdByLoginOrEmail(
            req.body.loginOrEmail
         );
         if (userId) {
            const accessToken = await JWTService.createJWT(userId);
            const resToken = {
               accessToken: accessToken,
            };
            res.status(200).send(resToken);
            return;
         }
      }

      res.sendStatus(401);
      return;
   }
);

authRoute.get('/me', accessTokenGuard, async (req: Request, res: Response) => {
   if (!req.user) {
      console.log('No req.user');
      res.sendStatus(401);
      return;
   }
   const { email, login, userId } = req.user;
   const userObj = {
      email: email,
      login: login,
      userId: userId,
   };
   res.send(userObj).status(200);
});
