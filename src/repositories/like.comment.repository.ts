import { LikeCommentModelClass } from "../db/db";
import { LikeStatusEnum } from "../models/common/enums";
import { LikeCommentDB } from "../models/common/likes/like.comment.db.type";
import { likeCommentMapper } from "../models/common/likes/mappers/like.comment.mapper";
import { LikeCommentOutputType } from "../models/common/likes/output/like.comment.output.type";

export class LikeCommentRepository {
    static async createLikeForComment(likeData: LikeCommentDB): Promise<boolean> {
        try {
        const like = await LikeCommentModelClass.create(likeData);
            if (!like._id) {
               return false;
            }
            return true;
         } catch (error) {
            console.log(error);
            return false;
         }
    }

    static async findLikeByCommentIdAndUserId(commentId: string, userId: string): Promise<LikeCommentOutputType | null> {
        try {
            const like = await LikeCommentModelClass.findOne({commentId: commentId, userId: userId}).lean();
            if (!like) {
               console.log("Like not found");
               return null;
            }
            return likeCommentMapper(like);
         } catch (error) {
            console.log(error);
            return null;
         }
    }

    static async getCountOfLikesByCommentId(commentId: string): Promise<{
        likesCount: number;
        dislikesCount: number;
    } | null> {
        try {
            const likeCount = await LikeCommentModelClass.countDocuments({commentId: commentId, likeStatus: "Like"}).lean();

            const dislikeCount = await LikeCommentModelClass.countDocuments({commentId: commentId, likeStatus: "Dislike"}).lean();

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
            const res = await LikeCommentModelClass.updateOne({_id: id}, { $set: { likeStatus: likeStatus }});
            return!!res.modifiedCount;

         } catch (error) {
            console.log(error);
            return false;
         }

    }
}