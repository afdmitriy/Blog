import { ValidationChain, body } from 'express-validator';
import { inputValidationMiddleware } from '../middlewares/inputValidation/input-validation-middleware';
import { UserRepository } from '../repositories/user.repository';
import { EmailConfirmationRepository } from '../repositories/email.confirmation.repository';

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

const emailRegistrationValidator: ValidationChain = body('email').custom(
   async (value) => {
      const user = await UserRepository.findUserByLoginOrEmail(value);
      if (user) {
         throw new Error('E-mail already in use');
      }
   }
);

const loginRegistrationValidator: ValidationChain = body('login').custom(
   async (value) => {
      const user = await UserRepository.findUserByLoginOrEmail(value);
      if (user) {
         throw new Error('Login already in use');
      }
   }
);

const emailResendValidator: ValidationChain = body('email').custom(
   async (value) => {
      const email = await UserRepository.findUserByLoginOrEmail(value);
      if (!email) {
         throw new Error('Email doesnt exist');
      }

      const userID = await UserRepository.getUserIdByLoginOrEmail(value);
      if (userID) {
         const confirmData =
            await EmailConfirmationRepository.findEmailConfirmationDataByUserId(
               userID
            );
         if (confirmData && confirmData.isConfirmed === true) {
            throw new Error('Email already confirmed');
         }
      }
   }
);

const isUserExistValidator: ValidationChain = body('email').custom(
   async (value) => {
      const user = await UserRepository.findUserByLoginOrEmail(value);
      if (!user) {
         throw new Error('Email doesnt exist');
      }
   }
);
// .withMessage('Email doesnt exist');

export const usersValidation = () => [
   // Обязательно должна быть функция по документации
   loginValidator,
   passwordValidator,
   emailValidator,
   inputValidationMiddleware,
];

export const registrationValidation = () => [
   loginValidator,
   passwordValidator,
   emailValidator,
   emailRegistrationValidator,
   loginRegistrationValidator,
   inputValidationMiddleware,
];

export const emailResendValidation = () => [
   emailValidator,
   emailResendValidator,
   inputValidationMiddleware,
];

export const emailValidation = () => [emailValidator, inputValidationMiddleware];

export const isUserExistValidation = () => [isUserExistValidator, inputValidationMiddleware];
