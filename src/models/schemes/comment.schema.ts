import mongoose from "mongoose";
import { CommentDB } from "../comment/db/comment.db";

export const CommentMongooseSchema = new mongoose.Schema<CommentDB>({
    content: String,
    postId: { type: String, required: true },
    commentatorInfo: {
       userId: { type: String, required: true },
       userLogin: { type: String, required: true },
    },
    createdAt: { type: Date, required: true },
})