import mongoose from "mongoose";
import { LikeCommentDB } from "../common/likes/like.comment.db.type";
import { LikeStatusEnum } from "../common/enums";


export const LikeCommentMongooseSchema = new mongoose.Schema<LikeCommentDB>({
    userId: { type: String, required: true },
    commentId: { type: String, required: true },
    createdAt: { type: Date, required: true },
    likeStatus: { type: String, enum: Object.values(LikeStatusEnum), default: LikeStatusEnum.None, required: true },
})