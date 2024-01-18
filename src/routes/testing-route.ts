import { Router, Request, Response } from 'express';
import { blogsCollection, postsCollection } from '../db/db';

export const testRoute: Router = Router({});

testRoute.delete('/', async (req, res) => {
   await blogsCollection.deleteMany({});
   await postsCollection.deleteMany({});

   res.status(204).send('All data is deleted');
});
