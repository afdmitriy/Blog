import { ValidationChain, body } from 'express-validator';
import { inputValidationMiddleware } from '../middlewares/inputValidation/input-validation-middleware';

const likeStatusValidator: ValidationChain = body('likeStatus')
   .isString()
   .withMessage('content must be a string')
   .trim()
   .isIn(['None', 'Like', 'Dislike'])
   .withMessage('Incorrect like status');

export const likeStatusValidation = () => [
   // Обязательно должна быть функция по документации
   likeStatusValidator,
   inputValidationMiddleware,
];