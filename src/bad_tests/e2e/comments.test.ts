import request from 'supertest';
import { app } from '../../src/settings';
import { connectToDB } from '../../src/db/db';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('tests for /blogs', () => {
   beforeAll(async () => {
      await connectToDB();
      await request(app).delete('/testing/all-data');
   });
});
