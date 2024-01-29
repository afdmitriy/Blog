import { ObjectId, WithId } from 'mongodb';
import { blogsCollection, postsCollection } from '../db/db';
import { blogMapper } from '../models/blog/mappers/blog-mapper';
import { OutputBlogType } from '../models/blog/output/outputBlogModel';
import { BlogDB } from '../models/blog/db/blog-db';
import { InputBlogType } from '../models/blog/input/inputBlogModel';
import { Pagination } from '../models/common';
import { postMapper } from '../models/post/mappers/post-mapper';
import { OutputPostType } from '../models/post/output/outputPostModel';

type SortData = {
   searchNameTerm: string | null;
   sortBy: string;
   sortDirection: 'desc' | 'asc';
   pageNumber: number;
   pageSize: number;
};

type SortGetData = {
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

      const blogs = await blogsCollection
         .find(filter)
         .sort(sortBy, sortDirection)
         .skip((pageNumber - 1) * pageSize)
         .limit(pageSize)
         .toArray();

      const totalCount = await blogsCollection.countDocuments(filter);

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
      const blog = await blogsCollection.findOne({ _id: new ObjectId(id) });

      if (!blog) {
         return null;
      }
      return blogMapper(blog);
   }

   static async getBlogByIdWithQuery(
      id: string,
      sortData: SortGetData
   ): Promise<Pagination<OutputPostType> | null> {
      const check = await this.getBlogById(id);
      if (!check) {
         return null;
      }
      const { sortDirection, sortBy, pageNumber, pageSize } = sortData;

      // let filter = { blogId: id };

      const blogs = await postsCollection
         .find({ blogId: id })
         .sort(sortBy, sortDirection)
         .skip((pageNumber - 1) * pageSize)
         .limit(pageSize)
         .toArray();

      const totalCount = await postsCollection.countDocuments({ blogId: id });

      const pagesCount = Math.ceil(totalCount / pageSize);

      return {
         pagesCount,
         page: pageNumber,
         pageSize,
         totalCount,
         items: blogs.map(postMapper),
      };
   }
}
