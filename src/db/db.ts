import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import { BlogDB } from '../models/blog/db/blog-db';
import { PostDB } from '../models/post/db/post-db';
import { UsersDB } from '../models/users/db/users.db';
import { CommentDB } from '../models/comment/db/comment.db';
import { EmailConfirmDataDB } from '../models/common/email.confirmation/db/email.confirmation.db';
import { RefreshTokenBlackListDB } from '../models/common/email.confirmation/db/refresh.token.black.list';
import { UserSessionsDB } from '../models/auth/db/user.sessions.type';
import { ApiAccessLogsDB } from '../models/common/email.confirmation/db/api.access.logs';

dotenv.config();

export const mongoURI = process.env.MONGO_URL || 'error URI';

console.log(mongoURI);

const client = new MongoClient(mongoURI);

const dataBase = client.db('blog-db');

export const blogsCollection = dataBase.collection<BlogDB>('blogs');
export const postsCollection = dataBase.collection<PostDB>('posts');

export const usersCollection = dataBase.collection<UsersDB>('users');
export const commentsCollection = dataBase.collection<CommentDB>('comments');
export const emailConfirmDataCollection =
   dataBase.collection<EmailConfirmDataDB>('emailConfirmData');
export const refreshTokenBlackListCollection =
   dataBase.collection<RefreshTokenBlackListDB>('refreshTokenBlackList');
export const userSessionsCollection =
   dataBase.collection<UserSessionsDB>('userSessions');
export const apiAccessLogsCollection =
   dataBase.collection<ApiAccessLogsDB>('apiAccessLogs');


export const connectToDB = async () => {
   try {
      await client.connect();
      console.log('DB is connected');
   } catch (error) {
      console.log(error);
      await client.close();
   }
};
