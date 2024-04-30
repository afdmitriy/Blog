import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middlewares/auth/auth-midddleware';
import { BlogRepository } from '../repositories/blog-repository';
import { blogValidation } from '../validators/blog-validators';
import { ObjectId } from 'mongodb';
import { InputBlogType } from '../models/blog/input/inputBlogModel';
import { ParamType, QueryInputModel, RequestWithParamAndBody, RequestWithParamsAndQuery, RequestWithQuery } from '../models/common';
import { BlogQueryRepository } from '../repositories/blog.query.repository';
import { CreatePostFromBlogInputModel } from '../models/blog/input/create.post.from.blog';
import { createPostFromBlogValidation } from '../validators/post-validators';
import { QueryBlogInputModel } from '../models/blog/input/query.blog.input.model';
import { AuthService } from '../services/auth.service';
import { ResultStatus } from '../common/enums/ResultToRouterStatus';
import { PostService } from '../services/post.service';

export const blogRoute: Router = Router({});

blogRoute.get('/', async (req: RequestWithQuery<QueryBlogInputModel>, res) => {
   const sortData = {
      searchNameTerm: req.query.searchNameTerm ?? null,
      sortBy: req.query.sortBy ?? 'createdAt',
      sortDirection: req.query.sortDirection ?? 'desc',
      pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
      pageSize: req.query.pageSize ? +req.query.pageSize : 10,
   };

   const blogs = await BlogQueryRepository.getAllBlogs(sortData);
   res.status(200).send(blogs);
});

blogRoute.get('/:id', async (req, res) => {
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
   async (req: RequestWithParamsAndQuery<ParamType, QueryInputModel>, res) => {

      const blogId = req.params.id;
      try {
         if (!ObjectId.isValid(blogId) || !(await BlogRepository.getBlogById(blogId))) {
            res.sendStatus(404);
            return;
         }

         const token = req.headers.authorization
         let userId = undefined
         if (token) {
            const res = await AuthService.checkAccessToken(token)
            if (res.status === ResultStatus.SUCCESS) {
               userId = res.data!.userId
            }
         }

         const sortData = {
            sortBy: req.query.sortBy ?? 'createdAt',
            sortDirection: req.query.sortDirection ?? 'desc',
            pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
            pageSize: req.query.pageSize ? +req.query.pageSize : 10,
         };

         const posts = await PostService.getQueryPostsByBlogId(blogId, sortData, userId);  // Сейчас я возвращаю 404 но, что нужно возвратить, если постов у блога не найдено?
         if (!posts) {
            console.log('posts not found');
            res.sendStatus(404);
            return;
         }
         res.status(200).send(posts);

      } catch (error) {
         console.log(error);
         res.sendStatus(500);
      }
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
      const blogId = req.params.id;
      if (!ObjectId.isValid(blogId)) {
         res.sendStatus(404);
         return;
      }

      const createPostModel = {
         title: req.body.title,
         shortDescription: req.body.shortDescription,
         content: req.body.content,
         blogId: blogId,
      };

      const post = await PostService.createPostWithLikes(createPostModel);

      if (!post) {
         res.sendStatus(404);
         return;
      }

      res.status(201).send(post);
   }
);


blogRoute.post(
   '/',
   authMiddleware,
   blogValidation(),
   async (req: Request<{}, {}, InputBlogType>, res: Response) => {
      const name = req.body.name;
      const description = req.body.description;
      const websiteUrl = req.body.websiteUrl;

      const newBlog = {
         name,
         description,
         websiteUrl,
      };
      console.log(newBlog);
      const createdBlog = await BlogRepository.createBlog(newBlog);

      if (!createdBlog) {
         res.sendStatus(404);
         return;
      }

      res.status(201).send(createdBlog);
   }
);

blogRoute.put(
   '/:id',
   authMiddleware,
   blogValidation(),
   async (req: Request<{ id: string }, {}, InputBlogType>, res: Response) => {
      if (!ObjectId.isValid(req.params.id)) {
         res.sendStatus(404);
         return;
      }

      const blog = await BlogRepository.getBlogById(req.params.id);

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

blogRoute.delete('/:id', authMiddleware, async (req, res) => {
   if (!ObjectId.isValid(req.params.id)) {
      res.sendStatus(404);
      return;
   }

   const blog = await BlogRepository.getBlogById(req.params.id);

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
});
