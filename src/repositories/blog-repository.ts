import { ObjectId } from 'mongodb';
import { BlogModelClass } from '../db/db';
import { blogMapper } from '../models/blog/mappers/blog-mapper';
import { OutputBlogType } from '../models/blog/output/outputBlogModel';
import { BlogDB } from '../models/blog/db/blog-db';
import { InputBlogType } from '../models/blog/input/inputBlogModel';

export class BlogRepository {
   static async getAllBlogs(): Promise<OutputBlogType[]> {

      const blogs = await BlogModelClass.find({}).lean().exec();
      return blogs.map(blogMapper);
   }

   static async getBlogById(id: string): Promise<OutputBlogType | null> {
      const blog = await BlogModelClass.findOne({ _id: id }).lean();

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
         createdAt: new Date(),
         isMembership: false,
      };
      console.log(createdBlog);
      const createdBlo = await BlogModelClass.create(createdBlog);
      console.log('Blog created');

      return this.getBlogById(createdBlo._id.toString());
   }

   static async updateBlogById(
      id: string,
      updatedData: InputBlogType
   ): Promise<boolean> {
      try {
         const res = await BlogModelClass.updateOne(
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
         const res = await BlogModelClass.deleteOne({ _id: id});

         return !!res.deletedCount;
      } catch (error) {
         return false;
      }
   }
}
