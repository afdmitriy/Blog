import mongoose from "mongoose";
import { EmailConfirmDataDB } from "../common/email.confirmation/db/email.confirmation.db";

export const EmailConfirmationMongooseSchema = new mongoose.Schema<EmailConfirmDataDB>({
    userID: { type: String, required: true },
    confirmationCode: { type: String, required: true },
    expirationDate: { type: Date, required: true },
    isConfirmed: Boolean
})