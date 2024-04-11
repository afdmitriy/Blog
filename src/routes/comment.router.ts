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

export const commentRoute: Router = Router({});

commentRoute.get(
   '/:id',
   async (req: RequestWithParams<ParamType>, res: Response) => {
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

      res.status(200).send(comment);
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
