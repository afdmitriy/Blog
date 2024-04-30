import { ObjectId } from 'mongodb';
import { CommentModelClass } from '../db/db';
import { OutputCommentType } from '../models/comment/output/output.comment.model';
import { CommentQueryRepository } from './comment.query.repository';
import { commentMapper } from '../models/comment/mapper/comment.mapper';

type InputCommentModel = {
   content: string;
   commentatorInfo: {
      userId: string;
      userLogin: string;
   };
   createdAt: Date;
   postId: string;
};

export class CommentRepository {
   static async createComment(
      commentData: InputCommentModel
   ): Promise<OutputCommentType | null | false> {
      try {
         const createdComment = await CommentModelClass.create(commentData);

         const comment = await CommentQueryRepository.getCommentById(
            createdComment._id.toString()
         );

         if (!comment) {
            return null;
         }

         return comment;
      } catch (error) {
         console.log(error);
         return false;
      }
   }

   static async updateCommentById(
      id: string,
      content: string
   ): Promise<boolean> {
      try {
         const res = await CommentModelClass.updateOne(
            { _id: id },
            {
               $set: {
                  content: content,
               },
            }
         );

         return !!res.matchedCount;
      } catch (error) {
         return false;
      }
   }

   static async deleteCommentById(id: string): Promise<boolean> {
      try {
         const res = await CommentModelClass.deleteOne({
            _id: id,
         });

         return !!res.deletedCount;
      } catch (error) {
         console.log(error);
         return false;
      }
   }

   static async doesCommentExistById(id: string) {
      try {
         const comment = await CommentModelClass.findOne({
            _id: id,
         }).lean();

         if (!comment) {
            return null;
         }
         return true;
      } catch (error) {
         console.log(error);
         return false;
      }
   }

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
}
