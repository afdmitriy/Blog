import { ValidationChain, body } from 'express-validator';
import { BlogRepository } from '../repositories/blog-repository';
import { inputValidationMiddleware } from '../middlewares/inputValidation/input-validation-middleware';
import { BlogQueryRepository } from '../repositories/blog.query.repository';

const titleValidator: ValidationChain = body('title')
   .isString()
   .withMessage('Name must be a string')
   .trim()
   .isLength({ min: 1, max: 30 })
   .withMessage('Incorrect Name');

const shortDescriptionValidator: ValidationChain = body('shortDescription')
   .isString()
   .withMessage('shortDescription must be a string')
   .trim()
   .isLength({ min: 1, max: 100 })
   .withMessage('Incorrect description');

const contentValidator: ValidationChain = body('content')
   .isString()
   .withMessage('content must be a string')
   .trim()
   .isLength({ min: 1, max: 1000 })
   .withMessage('content length must be min: 1, max: 1000');

const blogIdValidator: ValidationChain = body('blogId')
   .isString()
   .withMessage('blogId must be a string')
   .custom(async (value) => {
      const blog = await BlogQueryRepository.getBlogById(value);
      if (!blog) {
         throw Error('Incorrect blogId');
      }
      return true;
   });

export const postValidation = () => [
   // Обязательно должна быть функция по документации
   titleValidator,
   shortDescriptionValidator,
   contentValidator,
   blogIdValidator,
   inputValidationMiddleware,
];

export const createPostFromBlogValidation = () => [
   // Обязательно должна быть функция по документации
   titleValidator,
   shortDescriptionValidator,
   contentValidator,
   inputValidationMiddleware,
];
