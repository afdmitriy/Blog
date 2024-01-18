import { ObjectId, WithId } from 'mongodb';
import { blogsCollection } from '../db/db';
import { blogMapper } from '../models/blog/mappers/blog-mapper';
import { OutputBlogType } from '../models/blog/output/outputBlogModel';
import { BlogDB } from '../models/blog/db/blog-db';
import { InputBlogType } from '../models/blog/input/inputBlogModel';

export class BlogRepository {
   static async getAllBlogs(): Promise<OutputBlogType[]> {
      const blogs = await blogsCollection.find({}).toArray();
      return blogs.map(blogMapper);
   }

   static async getBlogById(id: string): Promise<OutputBlogType | null> {
      const blog = await blogsCollection.findOne({ _id: new ObjectId(id) });

      if (!blog) {
         return null;
      }
      return blogMapper(blog);
   }

   static async createBlog(
      createdData: InputBlogType
   ): Promise<OutputBlogType | null> {
      const createdBlog: BlogDB = {
         ...createdData,
         createdAt: new Date().toISOString(),
         isMembership: false,
      };

      const createdBlo = await blogsCollection.insertOne(createdBlog);

      return this.getBlogById(createdBlo.insertedId.toString());
   }

   static async updateBlogById(
      id: string,
      updatedData: InputBlogType
   ): Promise<boolean> {
      try {
         const res = await blogsCollection.updateOne(
            { _id: new ObjectId(id) },
            {
               $set: {
                  name: updatedData.name,
                  description: updatedData.description,
                  websiteUrl: updatedData.websiteUrl,
               },
            }
         );

         return !!res.matchedCount;
      } catch (error) {
         return false;
      }
   }

   static async deleteBlogById(id: string): Promise<boolean> {
      try {
         const res = await blogsCollection.deleteOne({ _id: new ObjectId(id) });

         return !!res.deletedCount;
      } catch (error) {
         return false;
      }
   }
}
