import { ObjectId, WithId } from 'mongodb';
import { blogsCollection, postsCollection } from '../db/db';
import { postMapper } from '../models/post/mappers/post-mapper';
import { OutputPostType } from '../models/post/output/outputPostModel';
import { PostDB } from '../models/post/db/post-db';
import { InputPostType } from '../models/post/input/inputPostModel';
import { BlogRepository } from './blog-repository';
import { BlogQueryRepository } from './blog.query.repository';
import { PostQueryRepository } from './post.query.repository';

export class PostRepository {
   static async getPostById(id: string): Promise<PostDB | null> {
      const post = await postsCollection.findOne({ _id: new ObjectId(id) });

      if (!post) {
         return null;
      }

      return post;
   }

   static async createPost(
      postData: InputPostType
   ): Promise<OutputPostType | null> {
      const blog = await BlogQueryRepository.getBlogById(postData.blogId);

      const newPost: PostDB = {
         ...postData,
         blogName: blog!.name,
         createdAt: new Date().toISOString(),
      };

      const createdPost = await postsCollection.insertOne(newPost);

      const post = await PostQueryRepository.getPostById(
         createdPost.insertedId.toString()
      );

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
         const res = await postsCollection.updateOne(
            { _id: new ObjectId(id) },
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
         const res = await postsCollection.deleteOne({ _id: new ObjectId(id) });

         return !!res.deletedCount;
      } catch (error) {
         return false;
      }
   }
}
