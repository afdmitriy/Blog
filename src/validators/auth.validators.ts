import { ValidationChain, body } from 'express-validator';
import { inputValidationMiddleware } from '../middlewares/inputValidation/input-validation-middleware';
import { EmailConfirmationRepository } from '../repositories/email.confirmation.repository';

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

const newPasswordValidator: ValidationChain = body('newPassword')
   .isString()
   .withMessage('password must be a string')
   .trim()
   .isLength({ min: 6, max: 20 })
   .withMessage('Incorrect password length');

const codeValidator: ValidationChain = body('recoveryCode')
   .isString()
   .withMessage('code must be a string')
   .trim()
   .custom(async (value) => {
      const confirmData =
         await EmailConfirmationRepository.findConfirmationDataByConfirmCode(
            value
         );
      
      if (!confirmData) {
         throw new Error('Invalid code');
      }
      if (confirmData.expirationDate < new Date()) {
         throw new Error('Code expired');
      }
      if (confirmData.isConfirmed === true) {
         throw new Error('Code already confirmed');
      }

      return true;
   });
//  .withMessage('Invalid code');

export const authValidation = () => [
   // Обязательно должна быть функция по документации
   loginValidator,
   passwordValidator,
   inputValidationMiddleware,
];

export const newPasswordValidation = () => [newPasswordValidator, inputValidationMiddleware];
export const codeValidation = () => [codeValidator, inputValidationMiddleware];
export const passwordValidation = () => [passwordValidator, inputValidationMiddleware];
