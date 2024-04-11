import { app } from '../../settings';
import { connectToDB } from '../../db/db';
import { AuthService } from '../../services/auth.service';

const supertest = require('supertest');

const request = supertest(app);

describe('integration tests for registration', () => {
   beforeAll(async () => {
      await connectToDB();
      await request.delete('/testing/all-data');
   });
   beforeEach(async () => {
      await request.delete(`testing/all-data`);
   });

   it('should register user with correct data', async () => {
      const registerUserUseCase = AuthService.userRegistration;
      const userInputData = createTestUserInputData();

      emailManager.sendRegistrationEmail = jest
         .fn()
         .mockImplementation((email: string, confirmationCode: string) => {
            return 'Email send success';
         });

      const result = await registerUserUseCase(userInputData);

      expect(result.status).toBe(ResultToRouterStatus.SUCCESS);
      expect(emailManager.sendRegistrationEmail).toHaveBeenCalledTimes(1);
      expect(emailManager.sendRegistrationEmail).toHaveBeenCalledWith(
         userInputData.email,
         expect.any(String)
      );
   });
});
