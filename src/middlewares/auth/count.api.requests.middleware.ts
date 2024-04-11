import { NextFunction, Request, Response } from 'express';
import { apiAccessLogsCollection } from '../../db/db';

export const countApiRequestMiddleware = async (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   const filter = {
      IP: req.ip,
      URL: req.originalUrl,
      date: { $gte: new Date(Date.now() - 10000) },
   };
   const count = await apiAccessLogsCollection.countDocuments(filter);
   if (count > 5) {
      res.sendStatus(429); // Too many requests
      return;
   }
   next();
};
