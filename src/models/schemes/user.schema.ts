import mongoose from "mongoose";
import { UsersDB } from "../users/db/users.db";


export const UserMongooseSchema = new mongoose.Schema<UsersDB>({
    login: { type: String, required: true },
    email: { type: String, required: true },
    createdAt: { type: String, required: true },
    passwordHash: { type: String, required: true },
    passwordSalt: { type: String, required: true },
})