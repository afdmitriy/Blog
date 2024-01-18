import { ValidationChain, body } from 'express-validator';
import { inputValidationMiddleware } from '../middlewares/inputValidation/input-validation-middleware';

const nameValidator: ValidationChain = body('name')
   .isString()
   .withMessage('Name must be a string')
   .trim()
   .isLength({ min: 1, max: 15 })
   .withMessage('Incorrect Name');

const descriptionValidator: ValidationChain = body('description')
   .isString()
   .withMessage('Description must be a string')
   .trim()
   .isLength({ min: 1, max: 500 })
   .withMessage('Incorrect description');

const webSiteUrlValidator: ValidationChain = body('websiteUrl')
   .isString()
   .withMessage('websiteUrl must be a string')
   .trim()
   .isLength({ min: 1, max: 100 })
   .withMessage('websiteUrl length must be min: 1, max: 100')
   .matches('^https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$')
   .withMessage('Incorrect websiteUrl');

export const blogValidation = () => [
   // Обязательно должна быть функция по документации
   nameValidator,
   descriptionValidator,
   webSiteUrlValidator,
   inputValidationMiddleware,
];
