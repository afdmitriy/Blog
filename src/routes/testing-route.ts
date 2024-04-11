import { Router, Request, Response } from 'express';

import {
   apiAccessLogsCollection,
   blogsCollection,
   commentsCollection,
   emailConfirmDataCollection,
   postsCollection,
   refreshTokenBlackListCollection,
   userSessionsCollection,
   usersCollection,
} from '../db/db';


export const testRoute: Router = Router({});

testRoute.delete('/', async (req, res) => {
   await blogsCollection.deleteMany({});
   await postsCollection.deleteMany({});
   await commentsCollection.deleteMany({});
   await usersCollection.deleteMany({});
   await emailConfirmDataCollection.deleteMany({});
   await refreshTokenBlackListCollection.deleteMany({});
   await userSessionsCollection.deleteMany({});
   await apiAccessLogsCollection.deleteMany({});


   res.status(204).send('All data is deleted');
});
