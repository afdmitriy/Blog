import { ObjectId } from 'mongodb';
import { commentsCollection } from '../db/db';
import { OutputCommentType } from '../models/comment/output/output.comment.model';
import { CommentQueryRepository } from './comment.query.repository';

type InputCommentModel = {
   content: string;
   commentatorInfo: {
      userId: string;
      userLogin: string;
   };
   createdAt: string;
   postId: string;
};

export class CommentRepository {
   static async createComment(
      commentData: InputCommentModel
   ): Promise<OutputCommentType | null | false> {
      try {
         const createdComment = await commentsCollection.insertOne(commentData);

         const comment = await CommentQueryRepository.getCommentById(
            createdComment.insertedId.toString()
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
         const res = await commentsCollection.updateOne(
            { _id: new ObjectId(id) },
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
         const res = await commentsCollection.deleteOne({
            _id: new ObjectId(id),
         });

         return !!res.deletedCount;
      } catch (error) {
         console.log(error);
         return false;
      }
   }

   static async doesCommentExistById(id: string) {
      try {
         const comment = await commentsCollection.findOne({
            _id: new ObjectId(id),
         });

         if (!comment) {
            return null;
         }
         return true;
      } catch (error) {
         console.log(error);
         return false;
      }
   }
}
