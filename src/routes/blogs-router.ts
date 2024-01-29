import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middlewares/auth/auth-midddleware';
import { BlogRepository } from '../repositories/blog-repository';
import { blogValidation } from '../validators/blog-validators';
import { ObjectId } from 'mongodb';
import { InputBlogType } from '../models/blog/input/inputBlogModel';
import {
   ParamType,
   RequestWithBody,
   RequestWithParamAndBody,
   RequestWithParams,
   RequestWithParamsAndQuery,
   RequestWithQuery,
} from '../models/common';
import { QueryBlogInputModel } from '../models/blog/input/query.blog.input.model';
import { BlogQueryRepository } from '../repositories/blog.query.repository';
import { createPostFromBlogValidation } from '../validators/post-validators';
import { CreatePostFromBlogInputModel } from '../models/blog/input/create.post.from.blog';
import { BlogService } from '../services/blog.service';
import { QueryBlogGetModel } from '../models/blog/input/query.blog.get.model';

export const blogRoute: Router = Router({});

blogRoute.get('/', async (req: RequestWithQuery<QueryBlogInputModel>, res) => {
   const sortData = {
      // Не знаю могут ли они придти невалидные и надо ли это обработать
      searchNameTerm: req.query.searchNameTerm ?? null,
      sortBy: req.query.sortBy ?? 'createdAt',
      sortDirection: req.query.sortDirection ?? 'desc',
      pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
      pageSize: req.query.pageSize ? +req.query.pageSize : 10,
   };

   const blogs = await BlogQueryRepository.getAllBlogs(sortData);
   res.status(200).send(blogs);
});

blogRoute.get('/:id', async (req: RequestWithParams<ParamType>, res) => {
   if (!ObjectId.isValid(req.params.id)) {
      res.sendStatus(404);
      return;
   }

   const blog = await BlogQueryRepository.getBlogById(req.params.id);

   if (!blog) {
      res.sendStatus(404);
      return;
   }

   res.status(200).send(blog);
});

blogRoute.get(
   '/:id/posts',
   async (
      req: RequestWithParamsAndQuery<ParamType, QueryBlogGetModel>,
      res
   ) => {
      const id = req.params.id;
      if (!ObjectId.isValid(id)) {
         res.sendStatus(404);
         return;
      }

      const sortData = {
         sortBy: req.query.sortBy ?? 'createdAt',
         sortDirection: req.query.sortDirection ?? 'desc',
         pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
         pageSize: req.query.pageSize ? +req.query.pageSize : 10,
      };

      const blog = await BlogQueryRepository.getBlogByIdWithQuery(id, sortData);

      if (!blog) {
         res.sendStatus(404);
         return;
      }

      res.status(200).send(blog);
   }
);

blogRoute.post(
   '/',
   authMiddleware,
   blogValidation(),
   async (req: RequestWithBody<InputBlogType>, res: Response) => {
      const name = req.body.name;
      const description = req.body.description;
      const websiteUrl = req.body.websiteUrl;

      const newBlog = {
         name,
         description,
         websiteUrl,
      };

      const createdBlog = await BlogRepository.createBlog(newBlog);

      if (!createdBlog) {
         res.sendStatus(404);
         return;
      }

      res.status(201).send(createdBlog);
   }
);

blogRoute.post(
   '/:id/posts',
   authMiddleware,
   createPostFromBlogValidation(),
   async (
      req: RequestWithParamAndBody<ParamType, CreatePostFromBlogInputModel>,
      res: Response
   ) => {
      const id = req.params.id;
      if (!ObjectId.isValid(id)) {
         res.sendStatus(404);
         return;
      }

      const createPostModel = {
         title: req.body.title,
         shortDescription: req.body.shortDescription,
         content: req.body.content,
      };

      const post = await BlogService.createPostToBlog(id, createPostModel);

      if (!post) {
         res.sendStatus(404);
         return;
      }

      res.status(201).send(post);
   }
);

blogRoute.put(
   '/:id',
   authMiddleware,
   blogValidation(),
   async (
      req: RequestWithParamAndBody<ParamType, InputBlogType>,
      res: Response
   ) => {
      if (!ObjectId.isValid(req.params.id)) {
         res.sendStatus(404);
         return;
      }

      const blog = await BlogQueryRepository.getBlogById(req.params.id);

      if (!blog) {
         res.sendStatus(404);
         return;
      }

      const name = req.body.name;
      const description = req.body.description;
      const websiteUrl = req.body.websiteUrl;

      const updatedBlog = {
         name,
         description,
         websiteUrl,
      };
      await BlogRepository.updateBlogById(req.params.id, updatedBlog);
      res.sendStatus(204);
   }
);

blogRoute.delete(
   '/:id',
   authMiddleware,
   async (req: RequestWithParams<ParamType>, res: Response) => {
      if (!ObjectId.isValid(req.params.id)) {
         res.sendStatus(404);
         return;
      }

      const blog = await BlogQueryRepository.getBlogById(req.params.id);

      if (!blog) {
         res.sendStatus(404);
         return;
      }

      const isBlog = await BlogRepository.deleteBlogById(req.params.id);

      if (!isBlog) {
         res.sendStatus(404);
         return;
      }
      res.sendStatus(204);
   }
);
