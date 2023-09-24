import request from 'supertest';
import httpStatus from 'http-status';
import app from '../../../src/app';

describe('Health Check routes', () => {
  describe('GET /v1/health', () => {
    test('returns 200 response with uptime, message, and timestamp', async () => {
      const res = await request(app).get('/v1/health').send().expect(httpStatus.OK);

      expect(res.body).toEqual({
        uptime: expect.anything(),
        message: 'OK',
        timestamp: expect.anything(),
      });
    });
  });
});
