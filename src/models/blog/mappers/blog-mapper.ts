import { WithId } from 'mongodb';
import { BlogDB } from '../db/blog-db';
import { OutputBlogType } from '../output/outputBlogModel';

export const blogMapper = (blog: WithId<BlogDB>): OutputBlogType => {
   return {
      id: blog._id.toString(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt.toISOString(),
      isMembership: blog.isMembership,
   };
};
