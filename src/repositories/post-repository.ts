import { ObjectId, WithId } from 'mongodb';
import { CommentModelClass, PostModelClass } from '../db/db';
import { postMapper } from '../models/post/mappers/post-mapper';
import { OutputPostType } from '../models/post/output/outputPostModel';
import { PostDB } from '../models/post/db/post-db';
import { InputPostType } from '../models/post/input/inputPostModel';
import { BlogRepository } from './blog-repository';

export class PostRepository {
   static async getAllPosts(): Promise<OutputPostType[]> {
      const posts = await PostModelClass.find({}).exec();
      return posts.map(postMapper);
   }

   static async getPostById(id: string): Promise<OutputPostType | null> {
      const post = await PostModelClass.findOne({ _id: id }).lean();

      if (!post) {
         return null;
      }

      return postMapper(post);
   }

   static async createPost(
      newPost: PostDB
   ): Promise<OutputPostType | null> {

      const createdPost = await PostModelClass.create(newPost);

      const post = await this.getPostById(createdPost._id.toString());

      if (!post) {
         return null;
      }

      return post;
   }

   static async updatePostById(
      id: string,
      updatedData: InputPostType
   ): Promise<boolean> {
      try {
         const res = await PostModelClass.updateOne(
            { _id: id },
            {
               $set: {
                  title: updatedData.title,
                  shortDescription: updatedData.shortDescription,
                  content: updatedData.content,
                  blogId: updatedData.blogId,
               },
            }
         );

         return !!res.matchedCount;
      } catch (error) {
         return false;
      }
   }

   static async deletePostById(id: string): Promise<boolean> {
      try {
         const res = await PostModelClass.deleteOne({ _id: id });

         await CommentModelClass.deleteMany({ postId: id });

         return !!res.deletedCount;
      } catch (error) {
         return false;
      }
   }

}
