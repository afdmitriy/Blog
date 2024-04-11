import request from 'supertest';
import { app } from '../settings'; // Assuming Express app is exported from here
import { SecurityService } from '../services/security.service';
import { jest } from '@jest/globals';
import { ResultStatus } from '../common/enums/ResultToRouterStatus';

describe('GET /devices', () => {
   it('should return a list of devices when a valid session id is provided', async () => {
      jest
         .spyOn(SecurityService, 'getDevicesBySessionId')
         .mockResolvedValueOnce({
            data: [
               {
                  _id: 'device1',
                  issuedAt: '2021-01-01T00:00:00.000Z',
                  userID: '2355',
                  deviceName: 'device1',
                  expirationDate: new Date(),
                  ip: '127.0.0.1',
               },
            ],
            status: ResultStatus.Success,
         });
      const response = await request(app)
         .get('/devices')
         .set('Cookie', ['refreshToken=validToken']);
      expect(response.status).toBe(200);
      expect(response.body).toEqual([
         { deviceId: 'device1', issuedAt: '2021-01-01T00:00:00.000Z' },
      ]);
   });

   it('should return a 401 status when an invalid session id is provided', async () => {
      jest
         .spyOn(SecurityService, 'getDevicesBySessionId')
         .mockResolvedValueOnce({
            data: null,
            errorMessage: 'Device not found',
            status: ResultStatus.NotFound,
         });
      const response = await request(app)
         .get('/devices')
         .set('Cookie', ['refreshToken=invalidToken']);
      expect(response.status).toBe(401);
   });
});

describe('GET /devices', () => {
   it('should return user devices when the request is successful', async () => {
      const mockDevices = [
         { id: 1, name: 'Device 1' },
         { id: 2, name: 'Device 2' },
      ];
      jest
         .spyOn(SecurityService, 'getUserDevicesBySessionId')
         .mockResolvedValue({
            status: ResultStatus.SUCCESS,
            data: mockDevices,
         });

      const response = await request(app).get('/devices');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockDevices);
   });

   it('should return 404 status when devices are not found', async () => {
      jest
         .spyOn(SecurityService, 'getUserDevicesBySessionId')
         .mockResolvedValue({ status: ResultStatus.NOT_FOUND });

      const response = await request(app).get('/devices');

      expect(response.status).toBe(404);
   });

   it('should return 500 status when an error occurs', async () => {
      jest
         .spyOn(SecurityService, 'getUserDevicesBySessionId')
         .mockRejectedValue(new Error('Internal server error'));

      const response = await request(app).get('/devices');

      expect(response.status).toBe(500);
   });
});
