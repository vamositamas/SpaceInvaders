const request = require('supertest');
const app = require('../../server');

describe('Config API Routes', () => {
  describe('GET /api/config', () => {
    test('should return 200 with config object', async () => {
      const response = await request(app).get('/api/config');

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toHaveProperty('canvas');
      expect(response.body).toHaveProperty('player');
      expect(response.body).toHaveProperty('enemies');
      expect(response.body).toHaveProperty('difficulty');
    });

    test('should return valid config structure', async () => {
      const response = await request(app).get('/api/config');

      expect(response.body.canvas).toHaveProperty('width');
      expect(response.body.canvas).toHaveProperty('height');
      expect(response.body.player).toHaveProperty('speed');
      expect(response.body.player).toHaveProperty('fireRate');
      expect(response.body.player).toHaveProperty('lives');
    });
  });

  describe('PUT /api/config', () => {
    test('should update config with valid data and return 200', async () => {
      const updates = {
        player: {
          lives: 5,
        },
      };

      const response = await request(app)
        .put('/api/config')
        .send(updates)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toHaveProperty('player');
      expect(response.body.player.lives).toBe(5);
    });

    test('should update multiple fields', async () => {
      const updates = {
        canvas: { width: 1024 },
        player: { speed: 7 },
      };

      const response = await request(app)
        .put('/api/config')
        .send(updates)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.canvas.width).toBe(1024);
      expect(response.body.player.speed).toBe(7);
    });

    test('should return 400 for invalid data (negative value)', async () => {
      const updates = {
        player: {
          lives: -1,
        },
      };

      const response = await request(app)
        .put('/api/config')
        .send(updates)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('should return 400 for invalid data (wrong type)', async () => {
      const updates = {
        canvas: {
          width: 'invalid',
        },
      };

      const response = await request(app)
        .put('/api/config')
        .send(updates)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('should return 400 for empty request body', async () => {
      const response = await request(app)
        .put('/api/config')
        .send({})
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/config/reset', () => {
    test('should reset to default config and return 200', async () => {
      // First, modify the config
      await request(app)
        .put('/api/config')
        .send({ player: { lives: 10 } })
        .set('Content-Type', 'application/json');

      // Then reset
      const response = await request(app).post('/api/config/reset');

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body.player.lives).toBe(3); // Default value
    });

    test('should return complete default config', async () => {
      const response = await request(app).post('/api/config/reset');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('canvas');
      expect(response.body).toHaveProperty('player');
      expect(response.body).toHaveProperty('enemies');
      expect(response.body).toHaveProperty('difficulty');
    });
  });

  describe('Error Handling', () => {
    test('should return 404 for unknown routes', async () => {
      const response = await request(app).get('/api/config/nonexistent');

      expect(response.status).toBe(404);
    });

    test('should handle malformed JSON', async () => {
      const response = await request(app)
        .put('/api/config')
        .send('invalid json')
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
    });
  });
});
