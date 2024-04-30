import mongoose from "mongoose";
import { ApiAccessLogsDB } from "../common/email.confirmation/db/api.access.logs";

export const ApiLogMongooseSchema = new mongoose.Schema<ApiAccessLogsDB>({
    IP: { type: String },
    URL: { type: String, required: true },
    date: { type: Date, required: true },
})