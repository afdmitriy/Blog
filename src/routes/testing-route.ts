import { Router, Request, Response } from 'express';

import {
   ApiAccessLogsModelClass,
   BlogModelClass,
   CommentModelClass,
   EmailConfirmDataModelClass,
   PostModelClass,
   RefreshTokenBlackListModelClass,
   SessionModelClass,
   UserModelClass,
} from '../db/db';


export const testRoute: Router = Router({});

testRoute.delete('/', async (req, res) => {
   console.log('Start deleting all data');
   await BlogModelClass.deleteMany({});
   await PostModelClass.deleteMany({});
   await CommentModelClass.deleteMany({});
   await UserModelClass.deleteMany({});
   await EmailConfirmDataModelClass.deleteMany({});
   await RefreshTokenBlackListModelClass.deleteMany({});
   await SessionModelClass.deleteMany({});

   console.log('All data deleted');
   res.sendStatus(204);
   return
});
