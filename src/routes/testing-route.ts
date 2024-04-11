import { Router, Request, Response } from 'express';
<<<<<<< Updated upstream
import { blogsCollection, postsCollection } from '../db/db';
=======
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
>>>>>>> Stashed changes

export const testRoute: Router = Router({});

testRoute.delete('/', async (req, res) => {
   await blogsCollection.deleteMany({});
   await postsCollection.deleteMany({});
<<<<<<< Updated upstream
=======
   await commentsCollection.deleteMany({});
   await usersCollection.deleteMany({});
   await emailConfirmDataCollection.deleteMany({});
   await refreshTokenBlackListCollection.deleteMany({});
   await userSessionsCollection.deleteMany({});
   await apiAccessLogsCollection.deleteMany({});
>>>>>>> Stashed changes

   res.status(204).send('All data is deleted');
});
