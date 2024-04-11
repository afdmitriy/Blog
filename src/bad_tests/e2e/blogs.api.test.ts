import request from 'supertest';
import { app } from '../../settings';
import { connectToDB } from '../../db/db';

const login = process.env.LOGIN || 'admin';
const password = process.env.PASSWORD || 'qwerty';

describe('tests for /blogs', () => {
   beforeAll(async () => {
      await connectToDB();
      await request(app).delete('/testing/all-data');
   });

   it('should return 200 and empty items array', async () => {
      const res = await request(app).get('/blogs').expect(200, {
         pagesCount: 0,
         page: 1,
         pageSize: 10,
         totalCount: 0,
         items: [],
      });
      // console.log(res.body);
   });

   it("shouldn't create blog without authorization: status 401", async () => {
      const res = await request(app)
         .post('/blogs')
         .send({
            name: 'string',
            description: 'string',
            websiteUrl: 'https://ya.com',
         })
         .expect(401);
   });

   it('should return status 201', async () => {
      const res = await request(app)
         .post('/blogs')
         .auth('admin', 'qwerty')
         .send({
            name: 'string',
            description: 'string',
            websiteUrl: 'https://ya.com',
         })
         .expect(201);
      console.log(res.body);
   });
});
