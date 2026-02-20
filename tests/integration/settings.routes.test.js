const request = require('supertest');
const app = require('../../server');

const DEFAULT_SETTINGS = {
  soundEnabled: true,
  musicEnabled: true,
  volume: 75,
  difficulty: 'NORMAL',
  controlScheme: 'KEYBOARD'
};

describe('Settings Routes', () => {
  // Reset settings to defaults before each test to keep tests independent
  beforeEach(async () => {
    await request(app).post('/api/settings/reset');
  });

  describe('GET /api/settings', () => {
    test('should return current settings with 200', async () => {
      const response = await request(app).get('/api/settings');

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toHaveProperty('soundEnabled');
      expect(response.body).toHaveProperty('musicEnabled');
      expect(response.body).toHaveProperty('volume');
      expect(response.body).toHaveProperty('difficulty');
      expect(response.body).toHaveProperty('controlScheme');
    });

    test('should return valid settings values', async () => {
      const response = await request(app).get('/api/settings');

      expect(typeof response.body.soundEnabled).toBe('boolean');
      expect(typeof response.body.musicEnabled).toBe('boolean');
      expect(typeof response.body.volume).toBe('number');
      expect(['EASY', 'NORMAL', 'HARD']).toContain(response.body.difficulty);
      expect(['KEYBOARD', 'MOUSE']).toContain(response.body.controlScheme);
    });
  });

  describe('PUT /api/settings', () => {
    test('should update settings and return 200', async () => {
      const response = await request(app)
        .put('/api/settings')
        .send({ volume: 50 })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.volume).toBe(50);
    });

    test('should preserve other settings when partially updating', async () => {
      const response = await request(app)
        .put('/api/settings')
        .send({ difficulty: 'HARD' });

      expect(response.status).toBe(200);
      expect(response.body.difficulty).toBe('HARD');
      expect(response.body).toHaveProperty('soundEnabled');
      expect(response.body).toHaveProperty('volume');
    });

    test('should return 400 when body is empty', async () => {
      const response = await request(app)
        .put('/api/settings')
        .send({});

      expect(response.status).toBe(400);
    });

    test('should return 400 for invalid difficulty', async () => {
      const response = await request(app)
        .put('/api/settings')
        .send({ difficulty: 'INSANE' });

      expect(response.status).toBe(400);
    });

    test('should return 400 for volume out of range', async () => {
      const response = await request(app)
        .put('/api/settings')
        .send({ volume: 999 });

      expect(response.status).toBe(400);
    });

    test('should return 400 for invalid controlScheme', async () => {
      const response = await request(app)
        .put('/api/settings')
        .send({ controlScheme: 'GAMEPAD' });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/settings/reset', () => {
    test('should reset to defaults and return 200', async () => {
      // First change something
      await request(app).put('/api/settings').send({ volume: 10, difficulty: 'EASY' });

      const response = await request(app).post('/api/settings/reset');

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(DEFAULT_SETTINGS);
    });

    test('should return valid settings after reset', async () => {
      const response = await request(app).post('/api/settings/reset');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('soundEnabled');
      expect(response.body).toHaveProperty('difficulty');
    });
  });
});

