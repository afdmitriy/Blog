import mongoose from "mongoose";
import { BlogDB } from "../blog/db/blog-db";

export const BlogMongooseSchema = new mongoose.Schema<BlogDB>({
    name: { type: String, required: true, maxlength: 15 },
    description: { type: String, maxlength: 500 },
    websiteUrl: { type: String, maxlength: 100 },
    isMembership: Boolean,
    createdAt: Date,
})