import { ObjectId } from 'mongodb';
import { PostModelClass } from '../db/db';
import { postMapper } from '../models/post/mappers/post-mapper';
import { OutputPostType } from '../models/post/output/outputPostModel';
import { Pagination } from '../models/common';
import { PostMongooseSchema } from '../models/schemes/post.shema';

type SortGetData = {
   sortBy: string;
   sortDirection: 'desc' | 'asc';
   pageNumber: number;
   pageSize: number;
};

export class PostQueryRepository {
   static async getAllPosts(
      sortData: SortGetData
   ): Promise<Pagination<OutputPostType>> {
      const { sortDirection, sortBy, pageNumber, pageSize } = sortData;

      const posts = await PostModelClass
         .find({})
         .sort({ [sortBy]: sortDirection })
         .skip((pageNumber - 1) * pageSize)
         .limit(pageSize)
         .lean()
         .exec();

      const totalCount = await PostModelClass.countDocuments({});

      const pagesCount = Math.ceil(totalCount / pageSize);

      return {
         pagesCount,
         page: pageNumber,
         pageSize,
         totalCount,
         items: posts.map(postMapper),
      };
   }

   static async getPostById(id: string): Promise<OutputPostType | null> {
      const post = await PostModelClass.findOne({ _id: id }).lean();

      if (!post) {
         return null;
      }

      return postMapper(post);
   }

   static async getPostsByBlogIdWithQuery(
      id: string,
      sortData: SortGetData
   ): Promise<Pagination<OutputPostType> | null> {

      const { sortDirection, sortBy, pageNumber, pageSize } = sortData;

      // let filter = { blogId: id };

      const blogs = await PostModelClass
         .find({ blogId: id })
         .sort({ [sortBy]: sortDirection })
         .skip((pageNumber - 1) * pageSize)
         .limit(pageSize)
         .lean()
         .exec();

      const totalCount = await PostModelClass.countDocuments({ blogId: id });

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
