const request = require('supertest');
const app = require('../../server');

describe('Server Health Check', () => {
  test('GET /health should return status 200', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
  });
});
