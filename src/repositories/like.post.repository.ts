import { LikePostModelClass } from "../db/db";
import { LikeStatusEnum } from "../models/common/enums";
import { LikePostDB } from "../models/common/likes/like.post.db.type";
import { likePostMapper } from "../models/common/likes/mappers/like.post.mapper";
import { LikePostOutputType } from "../models/common/likes/output/lilke.post.output.type";
import { NewestLikes } from "../models/post/output/output.post.with.like.model";


export class LikePostRepository {
    static async createLikeForComment(likeData: LikePostDB): Promise<boolean> {
        try {
        const like = await LikePostModelClass.create(likeData);
            if (!like._id) {
               return false;
            }
            return true;
         } catch (error) {
            console.log(error);
            return false;
         }
    }

    static async findLikeByPostIdAndUserId(postId: string, userId: string): Promise<LikePostOutputType | null> {
        try {
            const like = await LikePostModelClass.findOne({postId: postId, userId: userId}).lean();
            if (!like) {
               console.log("Like not found");
               return null;
            }
            return likePostMapper(like);
         } catch (error) {
            console.log(error);
            return null;
         }
    }

    static async getCountOfLikesByCommentId(postId: string): Promise<{
        likesCount: number;
        dislikesCount: number;
    } | null> {
        try {
            const likeCount = await LikePostModelClass.countDocuments({postId: postId, likeStatus: "Like"}).lean();

            const dislikeCount = await LikePostModelClass.countDocuments({postId: postId, likeStatus: "Dislike"}).lean();

            const likesCount = {
               likesCount: likeCount,
               dislikesCount: dislikeCount
            }
            console.log('Количество лайков: ', likesCount);
            return likesCount;
         } catch (error) {
            console.log(error);
            return null;
         }
    }

    static async updateLikeStatus(id: string, likeStatus: LikeStatusEnum): Promise<boolean> {
      try {
         const res = await LikePostModelClass.updateOne({_id: id}, { $set: { likeStatus: likeStatus }});
         return!!res.modifiedCount;

      } catch (error) {
         console.log(error);
         return false;
      }

   }

   static async findThreeNewestLikesByPostId(postId: string): Promise<false | LikePostOutputType[]> {
      try {
         const res = await LikePostModelClass.find({postId: postId, likeStatus: LikeStatusEnum.Like}).sort({createdAt: -1}).limit(3).lean();
         if (!res || res.length === 0) return [] 
         
         return res.map(likePostMapper);
      } catch (error) {
         console.log(error);
         return false;
      }
   }
   
}