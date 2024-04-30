import mongoose from "mongoose";
import { PostDB } from "../post/db/post-db";

export const PostMongooseSchema = new mongoose.Schema<PostDB>({
    title: { type: String, maxlength: 30 },
    shortDescription: { type: String, maxlength: 100 },
    content: { type: String, maxlength: 1000 },
    blogId: { type: String, required: true },
    blogName: String,
    createdAt: Date
})