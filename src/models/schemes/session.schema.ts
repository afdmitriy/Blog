import mongoose from "mongoose";
import { UserSessionsDB } from "../auth/db/user.sessions.type";

export const SessionMongooseSchema = new mongoose.Schema<UserSessionsDB>({
    userID: { type: String, required: true },
    expirationDate: { type: Date, required: true },
    issuedAt: { type: Date, required: true },
    deviceName: String,
    ip: String
})