import { apiAccessLogsCollection } from '../db/db';
import { ApiAccessLogsDB } from '../models/common/email.confirmation/db/api.access.logs';

export class ApiAccessLogs {
   static async createLog(log: ApiAccessLogsDB) {
      try {
         const createdLog = await apiAccessLogsCollection.insertOne(log);

         return !!createdLog.insertedId;
      } catch (error) {
         console.log(error);
         return false;
      }
   }
}
