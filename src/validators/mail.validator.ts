import { ValidationChain, body } from 'express-validator';
import { inputValidationMiddleware } from '../middlewares/inputValidation/input-validation-middleware';
import { UserRepository } from '../repositories/user.repository';

const emailValidator: ValidationChain = body('email')
   .isString()
   .withMessage('email must be a string')
   .trim()
   .isEmail()
   .withMessage('not valid email')
   .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
   .withMessage('not valid email');

export const mailValidation = () => [
   // Обязательно должна быть функция по документации
   emailValidator,
   inputValidationMiddleware,
];
