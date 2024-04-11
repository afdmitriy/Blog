export type EmailConfirmDataDB = {
   userID: string;
   confirmationCode: string;
   expirationDate: Date;
   isConfirmed: boolean;
};
