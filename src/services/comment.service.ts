import { CommentDB } from '../models/comment/db/comment.db';
import { commentAddLikesInfoMapper } from '../models/comment/mapper/comment.add.likes.info.mapper';
import { OutputCommentsWithQuery } from '../models/comment/output/output.comment.query';
import { OutputCommentWithLikeType } from '../models/comment/output/output.comment.with.like.model';
import { QueryInputModel, SortGetData } from '../models/common';
import { LikeStatusEnum } from '../models/common/enums';
import { CommentQueryRepository } from '../repositories/comment.query.repository';
import { CommentRepository } from '../repositories/comment.repository';
import { LikeCommentRepository } from '../repositories/like.comment.repository';
import { PostQueryRepository } from '../repositories/post.query.repository';

export class CommentService {
   static async getQueryCommentsByPostId(
      postId: string,
      queryParams: QueryInputModel,
      userId?: string
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

         return commentAddLikesInfoMapper(comments, userId); ;
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
   ): Promise<OutputCommentWithLikeType | null> {
      const newComment: CommentDB = {
         content: content,
         postId: postId,
         commentatorInfo: {
            userId: userId,
            userLogin: userLogin,
         },
         createdAt: new Date(),
      };
      try {

         const comment = await CommentRepository.createComment(newComment);
         if (!comment) {
            return null;
         }
         // const likeData = {
         //    userId: userId,
         //    commentId: comment.id,
         //    createdAt: new Date(),
         //    likeStatus: LikeStatusEnum.None
         // }
         // const likeInfo = await LikeCommentRepository.createLikeForComment(likeData);

         return { ...comment,
            likesInfo: {
               likesCount: 0,
               dislikesCount: 0,
               myStatus: LikeStatusEnum.None
            }
         }
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

   

   static async getCommentWithLikes(commentId: string, userId?: string): Promise<OutputCommentWithLikeType | null> {
      const comment = await CommentRepository.getCommentById(commentId);
      if (!comment) {
         return null;
      }

      const likesInfo = await this.makeLikesInfo(commentId, userId)
      
      return {
        ...comment,
        likesInfo: likesInfo
      }
      
   }

   static async makeLikesInfo(commentId: string, userId?: string) {
      const likescount = await LikeCommentRepository.getCountOfLikesByCommentId(commentId)
   
      const likesInfo = {
         likesCount: likescount!.likesCount,
         dislikesCount: likescount!.dislikesCount,
         myStatus: LikeStatusEnum.None,
      }
      if (userId) {
         const likeStatus = await LikeCommentRepository.findLikeByCommentIdAndUserId(commentId, userId)
         if (likeStatus) {
            likesInfo.myStatus = likeStatus.likeStatus
         }
      }
      return likesInfo
   }

}
