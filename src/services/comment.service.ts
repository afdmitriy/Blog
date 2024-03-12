import { CommentDB } from '../models/comment/db/comment.db';
import { InputCommentType } from '../models/comment/input/input.comment.model';
import { OutputCommentType } from '../models/comment/output/output.comment.model';
import { OutputCommentsWithQuery } from '../models/comment/output/output.comment.query';
import { QueryInputModel, SortGetData } from '../models/common';
import { CommentQueryRepository } from '../repositories/comment.query.repository';
import { CommentRepository } from '../repositories/comment.repository';
import { PostQueryRepository } from '../repositories/post.query.repository';

export class CommentService {
   static async getCommentsByPostId(
      postId: string,
      queryParams: QueryInputModel
   ): Promise<OutputCommentsWithQuery | false | null> {
      const check = await PostQueryRepository.getPostById(postId);
      if (!check) {
         return null;
      }

      const commentParams: SortGetData = {
         sortBy: queryParams.sortBy ?? 'createdAt',
         sortDirection: queryParams.sortDirection ?? 'desc',
         pageNumber: queryParams.pageNumber ? +queryParams.pageNumber : 1,
         pageSize: queryParams.pageSize ? +queryParams.pageSize : 10,
      };

      try {
         const comments = await CommentQueryRepository.getCommentByPostId(
            postId,
            commentParams
         );

         if (!comments) {
            return null;
         }

         return comments;
      } catch (error) {
         console.log(error);
         return false;
      }
   }

   static async createComment(
      postId: string,
      content: string,
      userId: string,
      userLogin: string
   ): Promise<OutputCommentType | null> {
      const newComment: CommentDB = {
         content: content,
         postId: postId,
         commentatorInfo: {
            userId: userId,
            userLogin: userLogin,
         },
         createdAt: new Date().toISOString(),
      };
      try {
         const comment = await CommentRepository.createComment(newComment);
         if (!comment) {
            return null;
         }

         return comment;
      } catch (error) {
         console.log(error);
         return null;
      }
   }

   static async checkOwnerId(
      commentId: string,
      userId: string
   ): Promise<boolean | null> {
      try {
         const comment = await CommentQueryRepository.getCommentById(commentId);

         if (comment) {
            if (comment.commentatorInfo.userId === userId) {
               return true;
            }
         }
         return false;
      } catch (error) {
         console.log(error);
         return null;
      }
   }
}
