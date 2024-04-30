import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middlewares/auth/auth-midddleware';
import { PostRepository } from '../repositories/post-repository';
import { postValidation } from '../validators/post-validators';
import { ObjectId } from 'mongodb';
import { InputPostType } from '../models/post/input/inputPostModel';
import {
   ParamType,
   QueryInputModel,
   RequestWithParamAndBody,
   RequestWithParams,
   RequestWithParamsAndQuery,
   RequestWithQuery,
   SortGetData,
   
} from '../models/common';
import { commentValidation } from '../validators/comment.validators';
import { accessTokenGuard } from '../middlewares/auth/token.guards';
import { CommentService } from '../services/comment.service';
import { AuthService } from '../services/auth.service';
import { ResultStatus } from '../common/enums/ResultToRouterStatus';
import { likeStatusValidation } from '../validators/like.validator';
import { LikeStatusEnum } from '../models/common/enums';
import { UserService } from '../services/user.service';
import { PostService } from '../services/post.service';

export const postRoute: Router = Router({});

postRoute.get('/', async (req: RequestWithQuery<SortGetData>, res: Response) => {

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

   const posts = await PostService.getQueryAllPosts(sortData, userId);
   res.status(200).send(posts);
});

postRoute.get('/:id', async (req, res) => {
   try {
      if (!ObjectId.isValid(req.params.id) || !(await PostRepository.getPostById(req.params.id))) {
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

      const post = await PostService.getPostWithLikes(req.params.id, userId);

      res.status(200).send(post);

} catch (error) {
   console.log(error);
   res.sendStatus(500);
}
});

postRoute.post(
   '/',
   authMiddleware,
   postValidation(),
   async (req: Request<{}, {}, InputPostType>, res: Response) => {
      
      const newPost = {
         title: req.body.title,
         shortDescription: req.body.shortDescription,
         content: req.body.content,
         blogId: req.body.blogId,
      };

      const createdPost = await PostService.createPostWithLikes(newPost);

      if (!createdPost) {
         res.sendStatus(404);
         return;
      }
      console.log('Post created: ', createdPost);
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

postRoute.put(
   '/:id/like-status',
   accessTokenGuard,
   likeStatusValidation(),
   async (req: RequestWithParamAndBody<ParamType, { likeStatus: LikeStatusEnum }>, res: Response) => {
      console.log('Post роутер: ' + req.params.id + ' ' + req.body.likeStatus + ' ' + req.user.userId)
      try {
         if ( !ObjectId.isValid(req.params.id)  ||
         !(await PostRepository.getPostById(req.params.id))) {
            console.log('Не валидный ID поста: ' + req.params.id)
            res.sendStatus(404);
            return;
         }
         
         const like = {
            userId: req.user.userId,
            postId: req.params.id,
            likeStatus: req.body.likeStatus,
         }
         const result = await UserService.updateOrCreateLikeStatusForPost(like)  //Почему падает ошибка если не присвоить к переменной
         if(!result) {
            res.sendStatus(501);
            return
         }
         res.sendStatus(204);
         return
      } catch (error) {
         console.log(error);
         res.sendStatus(500);
         return
      }
   })


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

postRoute.get(
   '/:id/comments',
   async (
      req: RequestWithParamsAndQuery<ParamType, QueryInputModel>,
      res: Response
   ) => {
      
      if (!ObjectId.isValid(req.params.id)) {
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

      const postId = req.params.id;
      const post = await PostRepository.getPostById(postId);

      if (!post) {
         res.sendStatus(404);
         return;
      }

      const sortData = {
         sortBy: req.query.sortBy ?? 'createdAt',
         sortDirection: req.query.sortDirection ?? 'desc',
         pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
         pageSize: req.query.pageSize ? +req.query.pageSize : 10,
      };

      const comments = await CommentService.getQueryCommentsByPostId(
         postId,
         sortData,
         userId
      );

      // const comment = await CommentQueryRepository.getCommentByPostId(
      //    postId,
      //    sortData
      // );

      if (!comments) {
         res.sendStatus(404);
         return;
      }

      res.status(200).send(comments);
   }
);

postRoute.post(
   '/:id/comments',
   accessTokenGuard,
   commentValidation(), async (
      req: RequestWithParamAndBody<ParamType, { content: string }>,
      res: Response
   ) => {
      const postId = req.params.id;
      if (!ObjectId.isValid(postId) || postId === '') {
         res.sendStatus(404);
         return;
      }

      const post = await PostRepository.getPostById(postId);

      if (!post) {
         res.sendStatus(404);
         return;
      }

      const login = req.user?.login;
      const userId = req.user?.userId;
      const content = req.body.content;

      const comment = await CommentService.createComment(
         postId,
         content,
         userId,
         login
      );

      if (!comment) {
         res.sendStatus(404);
         return;
      }
      console.log('Comment created', comment);
      res.status(201).send(comment);
   }
);