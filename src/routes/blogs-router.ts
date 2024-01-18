import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middlewares/auth/auth-midddleware';
import { BlogRepository } from '../repositories/blog-repository';
import { blogValidation } from '../validators/blog-validators';
import { ObjectId } from 'mongodb';
import { InputBlogType } from '../models/blog/input/inputBlogModel';

export const blogRoute: Router = Router({});

blogRoute.get('/', async (req, res) => {
   const blogs = await BlogRepository.getAllBlogs();
   res.status(200).send(blogs);
});

blogRoute.get('/:id', async (req, res) => {
   if (!ObjectId.isValid(req.params.id)) {
      res.sendStatus(404);
      return;
   }

   const blog = await BlogRepository.getBlogById(req.params.id);

   if (!blog) {
      res.sendStatus(404);
      return;
   }

   res.status(200).send(blog);
});

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
