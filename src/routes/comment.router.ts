import { Router, Response } from 'express';
import { commentValidation } from '../validators/comment.validators';
import { accessTokenGuard } from '../middlewares/auth/token.guards';
import { ObjectId } from 'mongodb';
import { CommentQueryRepository } from '../repositories/comment.query.repository';
import { CommentService } from '../services/comment.service';
import {
   ParamType,
   RequestWithParamAndBody,
   RequestWithParams,
} from '../models/common';
import { CommentRepository } from '../repositories/comment.repository';
import { likeStatusValidation } from '../validators/like.validator';
import { UserService } from '../services/user.service';
import { LikeStatusEnum } from '../models/common/enums';
import { AuthService } from '../services/auth.service';
import { ResultStatus } from '../common/enums/ResultToRouterStatus';

export const commentRoute: Router = Router({});

commentRoute.get(
   '/:id',
   async (req: RequestWithParams<ParamType>, res: Response) => {
      try {
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
   
         const comment = await CommentService.getCommentWithLikes(req.params.id, userId)
   
         if (!comment) {
            res.sendStatus(404);
            return;
         }
   
         res.status(200).send(comment);
         return;
      } catch (error) {
         console.log(error);
         res.sendStatus(500);
      }

   }
);

commentRoute.put(
   '/:id',
   accessTokenGuard,
   commentValidation(),
   async (
      req: RequestWithParamAndBody<ParamType, { content: string }>,
      res: Response
   ) => {
      if (!ObjectId.isValid(req.params.id)) {
         res.sendStatus(404);
         return;
      }

      const comment = await CommentQueryRepository.getCommentById(
         req.params.id
      );

      if (!comment) {
         res.sendStatus(404);
         return;
      }

      const isEqualId = await CommentService.checkOwnerId(
         req.params.id,
         req.user.userId
      );

      if (!isEqualId) {
         res.sendStatus(403);
         return;
      }

      // const updatedPost =
      await CommentRepository.updateCommentById(
         req.params.id,
         req.body.content
      );
      
      res.sendStatus(204);
   }
);

commentRoute.put(
   '/:id/like-status',
   accessTokenGuard,
   likeStatusValidation(),
   async (req: RequestWithParamAndBody<ParamType, { likeStatus: LikeStatusEnum }>, res: Response) => {
      console.log('Роутер: ' + req.params.id + ' ' + req.body.likeStatus + ' ' + req.user.userId)
      try {
         if ( !ObjectId.isValid(req.params.id)  ||
         !(await CommentRepository.doesCommentExistById(req.params.id))) {
            console.log('Не валидный ID комментария ')
            res.sendStatus(404);
            return;
         }
         
         const like = {
            userId: req.user.userId,
            commentId: req.params.id,
            likeStatus: req.body.likeStatus,
         }
         const result = await UserService.updateLikeStatusForComment(like)  //Почему падает ошибка если не присвоить к переменной
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

commentRoute.delete(
   '/:id',
   accessTokenGuard,
   async (req: RequestWithParams<ParamType>, res: Response) => {
      if (
         !ObjectId.isValid(req.params.id) ||
         !(await CommentRepository.doesCommentExistById(req.params.id))
      ) {
         res.sendStatus(404);
         return;
      }
      const isEqualId = await CommentService.checkOwnerId(
         req.params.id,
         req.user.userId
      );

      if (!isEqualId) {
         res.sendStatus(403);
         return;
      }

      const isDeleted = await CommentRepository.deleteCommentById(
         req.params.id
      );

      if (!isDeleted) {
         res.sendStatus(404);
         return;
      }

      res.sendStatus(204);
      return;
   }
);
