export type OutputEmailConfirmationDataType = {
   id: string;
   userID: string;
   confirmationCode: string;
   expirationDate: Date;
   isConfirmed: boolean;
};
