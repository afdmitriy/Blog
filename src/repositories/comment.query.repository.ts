import { ObjectId } from 'mongodb';
import { CommentModelClass } from '../db/db';
import { commentMapper } from '../models/comment/mapper/comment.mapper';
import { OutputCommentType } from '../models/comment/output/output.comment.model';
import { Pagination, SortGetData } from '../models/common';

export class CommentQueryRepository {
   static async getCommentById(
      id: string
   ): Promise<OutputCommentType | null | false> {
      try {
         const comment = await CommentModelClass.findOne({
            _id: id,
         }).lean();

         if (!comment) {
            return null;
         }
         return commentMapper(comment);
      } catch (error) {
         console.log(error);
         return false;
      }
   }

   static async getCommentByPostId(
      postId: string,
      sortData: SortGetData
   ): Promise<Pagination<OutputCommentType> | null> {
      const { sortDirection, sortBy, pageNumber, pageSize } = sortData;

      const comments = await CommentModelClass
         .find({ postId: postId })
         .sort({ [sortBy]: sortDirection })
         .skip((pageNumber - 1) * pageSize)
         .limit(pageSize)
         .lean()
         .exec();

      const totalCount = await CommentModelClass.countDocuments({
         postId: postId,
      });

      const pagesCount = Math.ceil(totalCount / pageSize);
      
      return {
         pagesCount,
         page: pageNumber,
         pageSize,
         totalCount,
         items: comments.map(commentMapper),
      };
   }
}
