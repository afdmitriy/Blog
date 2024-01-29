import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middlewares/auth/auth-midddleware';
import { PostRepository } from '../repositories/post-repository';
import { postValidation } from '../validators/post-validators';
import { ObjectId } from 'mongodb';
import { InputPostType } from '../models/post/input/inputPostModel';
import { PostQueryRepository } from '../repositories/post.query.repository';
import { RequestWithQuery } from '../models/common';
import { QueryPostInputModel } from '../models/post/input/query.post.input.model';

export const postRoute: Router = Router({});

postRoute.get('/', async (req: RequestWithQuery<QueryPostInputModel>, res) => {
   const sortData = {
      // Не знаю могут ли они придти невалидные и надо ли это обработать
      sortBy: req.query.sortBy ?? 'createdAt',
      sortDirection: req.query.sortDirection ?? 'desc',
      pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
      pageSize: req.query.pageSize ? +req.query.pageSize : 10,
   };
   const posts = await PostQueryRepository.getAllPosts(sortData);
   res.status(200).send(posts);
});

postRoute.get('/:id', async (req, res) => {
   if (!ObjectId.isValid(req.params.id)) {
      res.sendStatus(404);
      return;
   }
   const post = await PostQueryRepository.getPostById(req.params.id);

   if (!post) {
      res.sendStatus(404);
      return;
   }

   res.status(200).send(post);
});

postRoute.post(
   '/',
   authMiddleware,
   postValidation(),
   async (req: Request<{}, {}, InputPostType>, res: Response) => {
      console.log('1');
      const newPost = {
         title: req.body.title,
         shortDescription: req.body.shortDescription,
         content: req.body.content,
         blogId: req.body.blogId,
      };

      const createdPost = await PostRepository.createPost(newPost);

      if (!createdPost) {
         res.sendStatus(404);
         return;
      }

      res.status(201).send(createdPost);
   }
);

postRoute.put(
   '/:id',
   authMiddleware,
   postValidation(),
   async (req: Request<{ id: string }, {}, InputPostType>, res: Response) => {
      if (!ObjectId.isValid(req.params.id)) {
         res.sendStatus(404);
         return;
      }

      const post = await PostRepository.getPostById(req.params.id);

      if (!post) {
         res.sendStatus(404);
         return;
      }

      const updatePost = {
         title: req.body.title,
         shortDescription: req.body.shortDescription,
         content: req.body.content,
         blogId: req.body.blogId,
      };

      const updatedPost = PostRepository.updatePostById(
         req.params.id,
         updatePost
      );
      res.sendStatus(204);
   }
);

postRoute.delete('/:id', authMiddleware, async (req, res) => {
   if (!ObjectId.isValid(req.params.id)) {
      res.sendStatus(404);
      return;
   }

   const post = await PostRepository.getPostById(req.params.id);

   if (!post) {
      res.sendStatus(404);
      return;
   }

   const isPost = await PostRepository.deletePostById(req.params.id);

   if (!isPost) {
      res.sendStatus(404);
      return;
   }
   res.sendStatus(204);
});
