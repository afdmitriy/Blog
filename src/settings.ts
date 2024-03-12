import express, { Express } from 'express';
import { blogRoute } from './routes/blogs-router';
import { testRoute } from './routes/testing-route';
import { postRoute } from './routes/posts-router';
import { userRoute } from './routes/users.router';
import { authRoute } from './routes/auth.router';
import { commentRoute } from './routes/comment.router';

export const app: Express = express();

app.use(express.json());

app.use('/blogs', blogRoute);

app.use('/posts', postRoute);

app.use('/users', userRoute);

app.use('/auth', authRoute);

app.use('/comments', commentRoute);

app.use('/testing/all-data', testRoute);
