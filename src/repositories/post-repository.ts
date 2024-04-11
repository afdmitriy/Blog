import { ObjectId, WithId } from 'mongodb';
import { blogsCollection, commentsCollection, postsCollection } from '../db/db';
import { postMapper } from '../models/post/mappers/post-mapper';
import { OutputPostType } from '../models/post/output/outputPostModel';
import { PostDB } from '../models/post/db/post-db';
import { InputPostType } from '../models/post/input/inputPostModel';
import { BlogRepository } from './blog-repository';

export class PostRepository {
   static async getAllPosts(): Promise<OutputPostType[]> {
      const posts = await postsCollection.find({}).toArray();
      return posts.map(postMapper);
   }

   static async getPostById(id: string): Promise<OutputPostType | null> {
      const post = await postsCollection.findOne({ _id: new ObjectId(id) });

      if (!post) {
         return null;
      }

      return postMapper(post);
   }

   static async createPost(
      postData: InputPostType
   ): Promise<OutputPostType | null> {
      const blog = await BlogRepository.getBlogById(postData.blogId);

      const newPost: PostDB = {
         ...postData,
         blogName: blog!.name,
         createdAt: new Date().toISOString(),
      };

      const createdPost = await postsCollection.insertOne(newPost);

      const post = await this.getPostById(createdPost.insertedId.toString());

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

         await commentsCollection.deleteMany({ postId: id });

         return !!res.deletedCount;
      } catch (error) {
         return false;
      }
   }
}
