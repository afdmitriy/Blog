import { Request, Response, NextFunction } from 'express';
import { Result, ValidationError, validationResult } from 'express-validator';

export const inputValidationMiddleware = (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   const formattedError = validationResult(req).formatWith(
      (error: ValidationError) => ({
         message: error.msg,
         field: error.type === 'field' ? error.path : 'unknown',
      })
   );

   if (!formattedError.isEmpty()) {
      const errorsMessages = formattedError.array({ onlyFirstError: true });

      res.status(400).send({ errorsMessages });
      return;
   }

   return next();
};
