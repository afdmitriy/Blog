import { ValidationChain, body } from 'express-validator';
import { inputValidationMiddleware } from '../middlewares/inputValidation/input-validation-middleware';

const contentValidator: ValidationChain = body('content')
   .isString()
   .withMessage('content must be a string')
   .trim()
   .isLength({ min: 20, max: 300 })
   .withMessage('Incorrect content length');

export const commentValidation = () => [
   // Обязательно должна быть функция по документации
   contentValidator,
   inputValidationMiddleware,
];
