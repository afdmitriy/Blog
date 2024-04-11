import { WithId } from 'mongodb';
import { EmailConfirmDataDB } from '../db/email.confirmation.db';
import { OutputEmailConfirmationDataType } from '../output.email.confirmation/output.email.confirmation';

export const emailConfirmationDataMapper = (
   emailConfirmationData: WithId<EmailConfirmDataDB>
): OutputEmailConfirmationDataType => {
   return {
      id: emailConfirmationData._id.toString(),
      userID: emailConfirmationData.userID,
      confirmationCode: emailConfirmationData.confirmationCode,
      expirationDate: emailConfirmationData.expirationDate,
      isConfirmed: emailConfirmationData.isConfirmed,
   };
};
