export {};
declare global {
   namespace Express {
      export interface Request {
         user: {
            email: string;
            login: string;
            userId: string;
            deviceId?: string;
         };
      }
   }
}
