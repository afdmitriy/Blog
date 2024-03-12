import { ValidationChain, body } from 'express-validator';
import { inputValidationMiddleware } from '../middlewares/inputValidation/input-validation-middleware';

const loginValidator: ValidationChain = body('login')
   .isString()
   .withMessage('Login must be a string')
   .trim()
   .isLength({ min: 3, max: 10 })
   .withMessage('Incorrect login length')
   .matches(/^[a-zA-Z0-9_-]*$/);

const passwordValidator: ValidationChain = body('password')
   .isString()
   .withMessage('password must be a string')
   .trim()
   .isLength({ min: 6, max: 20 })
   .withMessage('Incorrect password');

const emailValidator: ValidationChain = body('email')
   .isString()
   .withMessage('email must be a string')
   .trim()
   .isEmail()
   .withMessage('not valid email')
   .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
   .withMessage('not valid email');

export const usersValidation = () => [
   // Обязательно должна быть функция по документации
   loginValidator,
   passwordValidator,
   emailValidator,
   inputValidationMiddleware,
];
