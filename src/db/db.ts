import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import { BlogDB } from '../models/blog/db/blog-db';
import { PostDB } from '../models/post/db/post-db';
dotenv.config();

const mongoURI = process.env.MONGO_URL || 'error URI'; // Хочу убрать строку, но будет ошибка

console.log(mongoURI);

const client = new MongoClient(mongoURI);

// Указываем к какой базе коннектимся
const dataBase = client.db('blog-db');

export const blogsCollection = dataBase.collection<BlogDB>('blogs');
export const postsCollection = dataBase.collection<PostDB>('posts');

export const rundb = async () => {
   try {
      await client.connect();
      console.log('DB is connected');
   } catch (error) {
      console.log(error);
      await client.close();
   }
};
