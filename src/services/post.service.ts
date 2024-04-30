import { QueryInputModel, SortGetData } from "../models/common";
import { LikeStatusEnum } from "../models/common/enums";
import { LikePostOutputType } from "../models/common/likes/output/lilke.post.output.type";
import { PostDB } from "../models/post/db/post-db";
import { InputPostType } from "../models/post/input/inputPostModel";
import { postAddLikesInfoMapper } from "../models/post/mappers/post.add.likes.info.mapper";
import { OutputPoststsWithQuery } from "../models/post/output/output.post.query";
import { OutputPostWithLikeType } from "../models/post/output/output.post.with.like.model";
import { BlogRepository } from "../repositories/blog-repository";
import { LikePostRepository } from "../repositories/like.post.repository";
import { PostRepository } from "../repositories/post-repository";
import { PostQueryRepository } from "../repositories/post.query.repository";
import { UserRepository } from "../repositories/user.repository";


type LikesInfo = {
   newestLikes: NewestLikes[] | [];
   likesCount: number;
   dislikesCount: number;
   myStatus: LikeStatusEnum;
}

type NewestLikes = {
   addedAt: string
   userId: string
   login: string
}

export class PostService {
   
   static async getQueryAllPosts(queryParams: QueryInputModel, userId?: string) {
      const postParams: SortGetData = {
         sortBy: queryParams.sortBy ?? 'createdAt',
         sortDirection: queryParams.sortDirection ?? 'desc',
         pageNumber: queryParams.pageNumber ? +queryParams.pageNumber : 1,
         pageSize: queryParams.pageSize ? +queryParams.pageSize : 10,
      };
      try {
         
      const posts = await PostQueryRepository.getAllPosts(postParams);

         if (!posts) {
            return null;
         }

         return postAddLikesInfoMapper(posts, userId); ;
      } catch (error) {
         console.log(error);
         return false;
      }
   }

   static async getQueryPostsByBlogId(       //  Наверное, лучше в Query Service сделать
      blogId: string,
      queryParams: QueryInputModel,
      userId?: string
   ): Promise<OutputPoststsWithQuery | false | null> {

      const postParams: SortGetData = {
         sortBy: queryParams.sortBy ?? 'createdAt',
         sortDirection: queryParams.sortDirection ?? 'desc',
         pageNumber: queryParams.pageNumber ? +queryParams.pageNumber : 1,
         pageSize: queryParams.pageSize ? +queryParams.pageSize : 10,
      };

      try {
         const posts = await PostQueryRepository.getPostsByBlogIdWithQuery(
            blogId,
            postParams
         );

         if (!posts) {
            return null;
         }

         return postAddLikesInfoMapper(posts, userId); ;
      } catch (error) {
         console.log(error);
         return false;
      }
   }

   static async createPostWithLikes(
      postData: InputPostType
   ): Promise<OutputPostWithLikeType | null> {
      const blog = await BlogRepository.getBlogById(postData.blogId);
      const newPost: PostDB = {
         ...postData,
         blogName: blog!.name,
         createdAt: new Date(),
      };
      try {

         const post = await PostRepository.createPost(newPost);
         if (!post) {
            return null;
         }

         return { ...post,
            extendedLikesInfo: {
               likesCount: 0,
               dislikesCount: 0,
               myStatus: LikeStatusEnum.None,
               newestLikes: []

            }
         }
      } catch (error) {
         console.log(error);
         return null;
      }
   }


   static async getPostWithLikes(postId: string, userId?: string): Promise<OutputPostWithLikeType | null> {
      const post = await PostRepository.getPostById(postId);
      if (!post) {
         return null;
      }

      const likesInfo = await this.makeLikesInfo(postId, userId)
      
      return {
        ...post,
        extendedLikesInfo: likesInfo
      }
      
   }

   static async makeLikesInfo(postId: string, userId?: string): Promise<LikesInfo> {
      const likesCount = await LikePostRepository.getCountOfLikesByCommentId(postId)
   
      const likesInfo = {
         likesCount: likesCount!.likesCount,
         dislikesCount: likesCount!.dislikesCount,
         myStatus: LikeStatusEnum.None,
      }
      if (userId) {
         const likeStatus = await LikePostRepository.findLikeByPostIdAndUserId(postId, userId)
         if (likeStatus) {
            likesInfo.myStatus = likeStatus.likeStatus
         }
      }

      const extendedLikesInfo = {
         ...likesInfo,
         newestLikes: []
      }

      if (likesCount?.likesCount === 0) {
         return extendedLikesInfo
      }

      const newestLikes = await LikePostRepository.findThreeNewestLikesByPostId(postId) as LikePostOutputType[]

      const newLikes = newestLikes.map(like => (
         UserRepository.findUserById(like.userId).then(user => ({
            addedAt: like.createdAt,
            userId: like.userId,
            login: user!.login
         }
      ))))
 
      const extendedLikes = await Promise.all(newLikes)

      return {...likesInfo,
         newestLikes: extendedLikes
      }
   }



}
