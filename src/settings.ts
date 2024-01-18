import express, { Express } from 'express';
import { blogRoute } from './routes/blogs-router';
import { testRoute } from './routes/testing-route';
import { postRoute } from './routes/posts-router';

export const app: Express = express();

app.use(express.json());

app.use('/blogs', blogRoute);

app.use('/posts', postRoute);

app.use('/testing/all-data', testRoute);
