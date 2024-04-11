import { NextFunction, Request, Response } from 'express';
import { ApiAccessLogs } from '../repositories/api.log.repository';
import { ApiAccessLogsDB } from '../models/common/email.confirmation/db/api.access.logs';

export const apiLoggingMiddleware = async (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   const ip = req.ip;
   const url = req.originalUrl;
   const date = new Date();
   if (ip && url) {
      const log: ApiAccessLogsDB = {
         IP: ip,
         URL: url,
         date: date,
      };
      await ApiAccessLogs.createLog(log);
   }
   next();
};
