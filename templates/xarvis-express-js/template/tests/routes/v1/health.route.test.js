const request = require('supertest');
const httpStatus = require('http-status');
const app = require('../../../src/app');

describe('Health Check routes', () => {
  describe('GET /v1/health', () => {
    test('returns 200 response with uptime, message and timestamp', async () => {
      const res = await request(app).get('/v1/health').send().expect(httpStatus.OK);

      expect(res.body).toEqual({
        uptime: expect.anything(),
        message: 'OK',
        timestamp: expect.anything(),
      });
    });
  });
});
