import { ObjectId } from 'mongodb';
import { EmailConfirmDataDB } from '../models/common/email.confirmation/db/email.confirmation.db';
import { EmailConfirmDataModelClass } from '../db/db';
import { OutputEmailConfirmationDataType } from '../models/common/email.confirmation/output.email.confirmation/output.email.confirmation';
import { emailConfirmationDataMapper } from '../models/common/email.confirmation/mappers/email.confirmation.mapper';

export class EmailConfirmationRepository {
   static async createConfirmationCodeData(
      emailConfirmData: EmailConfirmDataDB
   ): Promise<boolean> {
      console.log(`Repository ${emailConfirmData.confirmationCode}`);
      try {
         const createdEmailData = await EmailConfirmDataModelClass.create(
            emailConfirmData
         );
         // const data = await this.findEmailConfirmationDataByUserId(
         //    emailConfirmData.userID
         // );
         if (!createdEmailData._id) {
            return false;
         }
         
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
         const emailConfirmationData = await EmailConfirmDataModelClass.findOne(
            {
               userID: userID,
            }
         ).lean();

         if (!emailConfirmationData) {
            return null;
         }
         return emailConfirmationDataMapper(emailConfirmationData);
      } catch (error) {
         console.log(error);
         return false;
      }
   }

   static async findConfirmationDataByConfirmCode(
      confirmCode: string
   ): Promise<OutputEmailConfirmationDataType | null | false> {
      try {
         const emailConfirmationData = await EmailConfirmDataModelClass.findOne(
            {
               confirmationCode: confirmCode,
            }
         ).lean();

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
         const res = await EmailConfirmDataModelClass.updateOne(
            { _id: id },
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
         const res = await EmailConfirmDataModelClass.updateOne(
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
