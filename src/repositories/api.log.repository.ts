import { ApiAccessLogsModelClass } from '../db/db';
import { ApiAccessLogsDB } from '../models/common/email.confirmation/db/api.access.logs';

export class ApiAccessLogs {
   static async createLog(log: ApiAccessLogsDB) {
      try {
         const createdLog = await ApiAccessLogsModelClass.create(log);

         return !!createdLog._id;
      } catch (error) {
         console.log(error);
         return false;
      }
   }
}
