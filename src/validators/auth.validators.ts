import { ValidationChain, body } from 'express-validator';
import { inputValidationMiddleware } from '../middlewares/inputValidation/input-validation-middleware';

const loginValidator: ValidationChain = body('loginOrEmail')
   .isString()
   .withMessage('Login or Email must be a string')
   .trim();

const passwordValidator: ValidationChain = body('password')
   .isString()
   .withMessage('password must be a string')
   .trim()
   .isLength({ min: 6, max: 20 })
   .withMessage('Incorrect password length');

export const authValidation = () => [
   // Обязательно должна быть функция по документации
   loginValidator,
   passwordValidator,
   inputValidationMiddleware,
];
