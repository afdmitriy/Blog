import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../../services/auth.service';
import { ResultStatus } from '../../common/enums/ResultToRouterStatus';

export const accessTokenGuard = async (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   if (!req.headers.authorization) {
      res.sendStatus(401);
      return;
   }

   const result = await AuthService.checkAccessToken(req.headers.authorization);
   if (result.status === ResultStatus.SUCCESS) {
      req.user = result.data!;
      next();
      return;
   }
   res.sendStatus(401);
   return;
};

// export const isUserLogged = async (
//    req: Request,
//    res: Response,
//    next: NextFunction
// ) => {
//    if (!req.headers.authorization) {
//       req.user = null;
//       next();
//       return;
//    }
//    res.sendStatus(401);
//    return;
// };

export const refreshTokenGuard = async (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   const refreshToken = req.cookies.refreshToken;
   if (!refreshToken || typeof refreshToken !== 'string') {
      res.sendStatus(401);
      return;
   }

   const result = await AuthService.checkRefreshToken(refreshToken);
   if (result.status === ResultStatus.SUCCESS && result.data) {
      req.user = result.data;
      next();
      return;
   }
   res.sendStatus(401);
   return;
};


      
