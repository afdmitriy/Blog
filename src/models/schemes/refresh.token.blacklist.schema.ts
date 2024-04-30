import mongoose from "mongoose";
import { RefreshTokenBlackListDB } from "../common/email.confirmation/db/refresh.token.black.list";

export const RefreshTokenBlackListMongooseSchema = new mongoose.Schema<RefreshTokenBlackListDB>({
    refreshToken: { type: String, required: true },
})