import mongoose from "mongoose";
import { LikePostDB } from "../common/likes/like.post.db.type";
import { LikeStatusEnum } from "../common/enums";


export const LikePostMongooseSchema = new mongoose.Schema<LikePostDB>({
    userId: { type: String, required: true },
    postId: { type: String, required: true },
    createdAt: { type: Date, required: true },
    likeStatus: { type: String, enum: Object.values(LikeStatusEnum), default: LikeStatusEnum.None, required: true },
})