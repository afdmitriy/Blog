import { ObjectId, WithId } from 'mongodb';
import { blogsCollection, postsCollection } from '../db/db';
import { postMapper } from '../models/post/mappers/post-mapper';
import { OutputPostType } from '../models/post/output/outputPostModel';
import { Pagination } from '../models/common';

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

      const posts = await postsCollection
         .find({})
         .sort(sortBy, sortDirection)
         .skip((pageNumber - 1) * pageSize)
         .limit(pageSize)
         .toArray();

      const totalCount = await postsCollection.countDocuments({});

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
      const post = await postsCollection.findOne({ _id: new ObjectId(id) });

      if (!post) {
         return null;
      }

      return postMapper(post);
   }
}
