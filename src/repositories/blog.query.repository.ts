import { ObjectId } from 'mongodb';
import { BlogModelClass, PostModelClass} from '../db/db';
import { blogMapper } from '../models/blog/mappers/blog-mapper';
import { OutputBlogType } from '../models/blog/output/outputBlogModel';
import { Pagination, SortGetData } from '../models/common';
import { postMapper } from '../models/post/mappers/post-mapper';
import { OutputPostType } from '../models/post/output/outputPostModel';

type SortData = {
   searchNameTerm: string | null;
   sortBy: string;
   sortDirection: 'desc' | 'asc';
   pageNumber: number;
   pageSize: number;
};

export class BlogQueryRepository {
   static async getAllBlogs(
      sortData: SortData
   ): Promise<Pagination<OutputBlogType>> {
      const { searchNameTerm, sortDirection, sortBy, pageNumber, pageSize } =
         sortData;

      let filter = {};

      if (searchNameTerm) {
         filter = {
            name: {
               $regex: searchNameTerm,
               $options: 'i',
            },
         };
      }

      const blogs = await BlogModelClass
         .find(filter)
         .sort({ [sortBy]: sortDirection }) 
         .skip((pageNumber - 1) * pageSize)
         .limit(pageSize)
         .lean()
         .exec();

      const totalCount = await BlogModelClass.countDocuments(filter);

      const pagesCount = Math.ceil(totalCount / pageSize);

      return {
         pagesCount,
         page: pageNumber,
         pageSize,
         totalCount,
         items: blogs.map(blogMapper),
      };
   }

   static async getBlogById(id: string): Promise<OutputBlogType | null> {
      const blog = await BlogModelClass.findOne({ _id: id }).lean();

      if (!blog) {
         return null;
      }
      return blogMapper(blog);
   }

   
}
