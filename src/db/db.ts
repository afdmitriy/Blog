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
import mongoose from 'mongoose'
import { UserMongooseSchema } from '../models/schemes/user.schema';
import { SessionMongooseSchema } from '../models/schemes/session.schema';
import { EmailConfirmationMongooseSchema } from '../models/schemes/email.confirmation.schema';
import { CommentMongooseSchema } from '../models/schemes/comment.schema';
import { PostMongooseSchema } from '../models/schemes/post.shema';
import { BlogMongooseSchema } from '../models/schemes/blog.schema';
import { RefreshTokenBlackListMongooseSchema } from '../models/schemes/refresh.token.blacklist.schema';
import { ApiLogMongooseSchema } from '../models/schemes/api.log.schema';
import { LikeCommentDB } from '../models/common/likes/like.comment.db.type';
import { LikeCommentMongooseSchema } from '../models/schemes/like.comment.schema';
import { LikePostMongooseSchema } from '../models/schemes/like.post.schema';
import { LikePostDB } from '../models/common/likes/like.post.db.type';

dotenv.config();

export const mongoURI = process.env.MONGO_URL || `mongodb://0.0.0.0:27017/${'blog-db'}`;

console.log(mongoURI);

export const UserModelClass = mongoose.model<UsersDB>('users', UserMongooseSchema)
export const CommentModelClass = mongoose.model<CommentDB>('comments', CommentMongooseSchema );
export const PostModelClass = mongoose.model<PostDB>('posts', PostMongooseSchema);
export const BlogModelClass = mongoose.model<BlogDB>('blogs', BlogMongooseSchema);
export const SessionModelClass = mongoose.model<UserSessionsDB>('userSessions', SessionMongooseSchema, 'userSessions');
export const EmailConfirmDataModelClass = mongoose.model<EmailConfirmDataDB>('emailConfirmData', EmailConfirmationMongooseSchema, 'emailConfirmData');
export const RefreshTokenBlackListModelClass = mongoose.model<RefreshTokenBlackListDB>('refreshTokenBlackList', RefreshTokenBlackListMongooseSchema, 'refreshTokenBlackList');
export const ApiAccessLogsModelClass = mongoose.model<ApiAccessLogsDB>('apiAccessLogs', ApiLogMongooseSchema, 'apiAccessLogs');
export const LikeCommentModelClass = mongoose.model<LikeCommentDB>('likeComment', LikeCommentMongooseSchema, 'likeComment');
export const LikePostModelClass = mongoose.model<LikePostDB>('likePost', LikePostMongooseSchema, 'likePost');


export const connectToDB = async () => {
   try {
      await mongoose.connect(mongoURI
      )
      console.log('DB is connected');
   } catch (error) {
      console.log(error);
      await mongoose.disconnect()
   }
};

// const client = new MongoClient(mongoURI);

// const dataBase = client.db('blog-db');


// export const blogsCollection = dataBase.collection<BlogDB>('blogs');

// export const postsCollection = dataBase.collection<PostDB>('posts');

// export const commentsCollection = dataBase.collection<CommentDB>('comments');

// export const emailConfirmDataCollection =

//    dataBase.collection<EmailConfirmDataDB>('emailConfirmData');

// export const refreshTokenBlackListCollection =

//    dataBase.collection<RefreshTokenBlackListDB>('refreshTokenBlackList');
// export const userSessionsCollection =

//    dataBase.collection<UserSessionsDB>('userSessions');
// export const apiAccessLogsCollection =

//    dataBase.collection<ApiAccessLogsDB>('apiAccessLogs');