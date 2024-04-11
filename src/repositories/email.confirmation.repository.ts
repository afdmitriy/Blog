import { ObjectId, WithId } from 'mongodb';
import { EmailConfirmDataDB } from '../models/common/email.confirmation/db/email.confirmation.db';
import { emailConfirmDataCollection } from '../db/db';
import { OutputEmailConfirmationDataType } from '../models/common/email.confirmation/output.email.confirmation/output.email.confirmation';
import { emailConfirmationDataMapper } from '../models/common/email.confirmation/mappers/email.confirmation.mapper';

export class EmailConfirmationRepository {
   static async createEmailConfirmation(
      emailConfirmData: EmailConfirmDataDB
   ): Promise<boolean> {
      console.log(`Repository ${emailConfirmData.confirmationCode}`);
      try {
         const createdEmailData = await emailConfirmDataCollection.insertOne(
            emailConfirmData
         );
         const data = await this.findEmailConfirmationDataByUserId(
            emailConfirmData.userID
         );
         if (!data) {
            return false;
         }
         console.log(data);
         return true;
      } catch (error) {
         console.log(error);
         return false;
      }
   }

   static async findEmailConfirmationDataByUserId(
      userID: string
   ): Promise<OutputEmailConfirmationDataType | null | false> {
      try {
         const emailConfirmationData = await emailConfirmDataCollection.findOne(
            {
               userID: userID,
            }
         );

         if (!emailConfirmationData) {
            return null;
         }
         return emailConfirmationDataMapper(emailConfirmationData);
      } catch (error) {
         console.log(error);
         return false;
      }
   }

   static async findEmailConfirmationDataByConfirmCode(
      confirmCode: string
   ): Promise<OutputEmailConfirmationDataType | null | false> {
      try {
         const emailConfirmationData = await emailConfirmDataCollection.findOne(
            {
               confirmationCode: confirmCode,
            }
         );

         if (!emailConfirmationData) {
            console.log(`44`);
            return null;
         }
         return emailConfirmationDataMapper(emailConfirmationData);
      } catch (error) {
         console.log(error);
         return false;
      }
   }

   static async confirmEmail(id: string) {
      try {
         const res = await emailConfirmDataCollection.updateOne(
            { _id: new ObjectId(id) },
            {
               $set: {
                  isConfirmed: true,
               },
            }
         );

         return !!res.matchedCount;
      } catch (error) {
         return false;
      }
   }

   static async updateConfirmationCode(code: string, userID: string) {
      try {
         const res = await emailConfirmDataCollection.updateOne(
            { userID: userID },
            {
               $set: {
                  confirmationCode: code,
               },
            }
         );

         return !!res.matchedCount;
      } catch (error) {
         return false;
      }
   }
}
