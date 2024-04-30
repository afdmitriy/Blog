import { CreatePostFromBlogInputModel } from '../models/blog/input/create.post.from.blog';
import { PostDB } from '../models/post/db/post-db';
import { OutputPostType } from '../models/post/output/outputPostModel';
import { BlogQueryRepository } from '../repositories/blog.query.repository';
import { PostRepository } from '../repositories/post-repository';


export class BlogService {
   // static async createPostToBlog(         
   //    blogId: string,
   //    createPostModel: CreatePostFromBlogInputModel
   // ): Promise<OutputPostType | null> {
   //    const blog = await BlogQueryRepository.getBlogById(blogId);

   //    if (!blog) {
   //       return null;
   //    }

   //    const title = createPostModel.title;
   //    const shortDescription = createPostModel.shortDescription;
   //    const content = createPostModel.content;

   //    const newPost: PostDB = {
   //       title,
   //       shortDescription,
   //       content,
   //       blogId,
   //       blogName: blog.name,
   //       createdAt: new Date(),
   //    };

   //    const createdPost = await PostRepository.createPost(newPost);

   //    if (!createdPost) {
   //       return null;
   //    }

   //    return createdPost;
   // }
}
