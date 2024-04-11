import express, { Express } from 'express';
import { blogRoute } from './routes/blogs-router';
import { testRoute } from './routes/testing-route';
import { postRoute } from './routes/posts-router';
<<<<<<< Updated upstream
=======
import { userRoute } from './routes/users.router';
import { authRoute } from './routes/auth.router';
import { commentRoute } from './routes/comment.router';
import cookieParser from 'cookie-parser';
import { securityRoute } from './routes/security.router';
import { apiLoggingMiddleware } from './middlewares/api.logging.middlewre';
>>>>>>> Stashed changes

export const app: Express = express();

app.set('trust proxy', true);

app.use(express.json());
app.use(cookieParser());
app.use(apiLoggingMiddleware);

app.use('/auth', authRoute);

app.use('/blogs', blogRoute);

app.use('/posts', postRoute);

<<<<<<< Updated upstream
=======
app.use('/comments', commentRoute);

app.use('/users', userRoute);

app.use('/security', securityRoute);

>>>>>>> Stashed changes
app.use('/testing/all-data', testRoute);
