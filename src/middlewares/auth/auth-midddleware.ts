import { NextFunction, Request, Response } from 'express';

const login1 = process.env.LOGIN;
const password1 = process.env.PASSWORD;

export const authMiddleware = (
   req: Request,
   res: Response,
   next: NextFunction
): void => {
   if (req.headers['authorization'] !== 'Basic YWRtaW46cXdlcnR5') {
      res.sendStatus(401);
      return;
   }

   // OR

   const auth: 'Basic YWRtaW46cXdlcnR5' = req.headers['authorization'];

   if (!auth) {
      res.sendStatus(401);
      return;
   }

   const [basic, token] = auth.split(' ');

   if (basic !== 'Basic') {
      res.sendStatus(401);
      return;
   }

   const decodedToken = Buffer.from(token, 'base64').toString();

   const [login, password] = decodedToken.split(':');

   if (login !== login1 || password !== password1) {
      res.sendStatus(401);
      return;
   }

   ///////////////////////////////////////////////

   return next();
};
