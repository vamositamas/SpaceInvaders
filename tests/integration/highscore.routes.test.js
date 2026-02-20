const request = require('supertest');
const app = require('../../server');
const HighScoreService = require('../../src/services/highscore.service');
const highscoreRoutes = require('../../src/routes/highscore.routes');

// Create service instance for test cleanup
const highScoreService = new HighScoreService();
const { scoreRateLimiter } = highscoreRoutes;

describe('HighScore API Routes', () => {
  beforeEach(async () => {
    // Clear high scores and reset rate limiter state before each test
    await highScoreService.clearAllScores();
    scoreRateLimiter.configure({ max: 1000 }); // effectively disable during general tests
    scoreRateLimiter.resetStore();
  });

  describe('GET /api/highscores', () => {
    test('should return empty array initially', async () => {
      const response = await request(app).get('/api/highscores');

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toEqual([]);
    });

    test('should return array of scores', async () => {
      // Add some test scores
      await highScoreService.addHighScore({
        playerName: 'Alice',
        score: 1000,
        level: 5,
      });
      await highScoreService.addHighScore({
        playerName: 'Bob',
        score: 2000,
        level: 10,
      });

      const response = await request(app).get('/api/highscores');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].score).toBe(2000); // Sorted by score descending
      expect(response.body[1].score).toBe(1000);
    });

    test('should respect limit query parameter', async () => {
      // Add multiple scores
      for (let i = 1; i <= 10; i++) {
        await highScoreService.addHighScore({
          playerName: `Player${i}`,
          score: i * 100,
          level: i,
        });
      }

      const response = await request(app).get('/api/highscores?limit=5');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(5);
      expect(response.body[0].score).toBe(1000); // Highest score first
    });

    test('should return all scores if no limit specified', async () => {
      // Add 3 scores
      for (let i = 1; i <= 3; i++) {
        await highScoreService.addHighScore({
          playerName: `Player${i}`,
          score: i * 100,
          level: i,
        });
      }

      const response = await request(app).get('/api/highscores');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(3);
    });

    test('should return 400 for invalid limit parameter', async () => {
      const response = await request(app).get('/api/highscores?limit=invalid');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('should return 400 for negative limit', async () => {
      const response = await request(app).get('/api/highscores?limit=-5');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/highscores', () => {
    test('should create new high score with valid data and return 201', async () => {
      const newScore = {
        playerName: 'Charlie',
        score: 5000,
        level: 15,
      };

      const response = await request(app)
        .post('/api/highscores')
        .send(newScore)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(201);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toHaveProperty('id');
      expect(response.body.playerName).toBe('Charlie');
      expect(response.body.score).toBe(5000);
      expect(response.body.level).toBe(15);
      expect(response.body).toHaveProperty('date');
    });

    test('should return 400 for missing required fields', async () => {
      const invalidScore = {
        playerName: 'Dave',
        // Missing score and level
      };

      const response = await request(app)
        .post('/api/highscores')
        .send(invalidScore)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('should return 400 for negative score', async () => {
      const invalidScore = {
        playerName: 'Eve',
        score: -100,
        level: 5,
      };

      const response = await request(app)
        .post('/api/highscores')
        .send(invalidScore)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('should return 400 for empty player name', async () => {
      const invalidScore = {
        playerName: '',
        score: 1000,
        level: 5,
      };

      const response = await request(app)
        .post('/api/highscores')
        .send(invalidScore)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('should truncate player name exceeding max length and return 201', async () => {
      const scoreWithLongName = {
        playerName: 'A'.repeat(25), // 25 chars — sanitizer truncates to 20
        score: 1000,
        level: 5,
      };

      const response = await request(app)
        .post('/api/highscores')
        .send(scoreWithLongName)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body.playerName.length).toBeLessThanOrEqual(20);
    });

    test('should return 400 for invalid level', async () => {
      const invalidScore = {
        playerName: 'Frank',
        score: 1000,
        level: 0, // Invalid level
      };

      const response = await request(app)
        .post('/api/highscores')
        .send(invalidScore)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('should handle malformed JSON', async () => {
      const response = await request(app)
        .post('/api/highscores')
        .send('invalid json')
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/highscores/:id', () => {
    test('should return specific score by id', async () => {
      const createdScore = await highScoreService.addHighScore({
        playerName: 'Grace',
        score: 3000,
        level: 8,
      });

      const response = await request(app).get(`/api/highscores/${createdScore.id}`);

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body.id).toBe(createdScore.id);
      expect(response.body.playerName).toBe('Grace');
      expect(response.body.score).toBe(3000);
    });

    test('should return 404 for non-existent id', async () => {
      const response = await request(app).get('/api/highscores/non-existent-id');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/highscores/:id', () => {
    test('should delete score and return 204', async () => {
      const createdScore = await highScoreService.addHighScore({
        playerName: 'Henry',
        score: 4000,
        level: 12,
      });

      const response = await request(app).delete(`/api/highscores/${createdScore.id}`);

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});

      // Verify it's actually deleted
      const allScores = await highScoreService.getAllHighScores();
      expect(allScores.find((s) => s.id === createdScore.id)).toBeUndefined();
    });

    test('should return 404 when deleting non-existent score', async () => {
      const response = await request(app).delete('/api/highscores/non-existent-id');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Anti-Cheat Validation', () => {
    test('should reject score exceeding level maximum', async () => {
      const response = await request(app)
        .post('/api/highscores')
        .send({ playerName: 'Cheater', score: 999999, level: 1 });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('should accept realistic score for level', async () => {
      const response = await request(app)
        .post('/api/highscores')
        .send({ playerName: 'Honest', score: 3000, level: 1 });

      expect(response.status).toBe(201);
    });

    test('should reject duration that is impossibly short for level', async () => {
      const response = await request(app)
        .post('/api/highscores')
        .send({ playerName: 'Speed', score: 100, level: 3, duration: 5 });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('should accept realistic duration for level', async () => {
      const response = await request(app)
        .post('/api/highscores')
        .send({ playerName: 'Normal', score: 100, level: 1, duration: 60 });

      expect(response.status).toBe(201);
    });

    test('should sanitize XSS in player name and save clean version', async () => {
      const response = await request(app)
        .post('/api/highscores')
        .send({ playerName: '<script>alert(1)</script>', score: 100, level: 1 });

      // Name has valid chars after stripping tags (e.g. "scriptalert1script")
      expect(response.status).toBe(201);
      expect(response.body.playerName).not.toContain('<');
      expect(response.body.playerName).not.toContain('>');
    });

    test('should return 400 when name is entirely invalid characters', async () => {
      const response = await request(app)
        .post('/api/highscores')
        .send({ playerName: '<<>>!!@@', score: 100, level: 1 });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Rate Limiting', () => {
    beforeEach(() => {
      // Use a tight limit so we can trigger it quickly
      scoreRateLimiter.configure({ max: 2 });
      scoreRateLimiter.resetStore();
    });

    afterEach(() => {
      // Restore to production default
      scoreRateLimiter.configure({ max: 1000 });
      scoreRateLimiter.resetStore();
    });

    test('should block submissions after rate limit is exceeded', async () => {
      const validScore = { playerName: 'RateTest', score: 100, level: 1 };

      await request(app).post('/api/highscores').send(validScore);
      await request(app).post('/api/highscores').send(validScore);
      const blocked = await request(app).post('/api/highscores').send(validScore);

      expect(blocked.status).toBe(429);
      expect(blocked.body).toHaveProperty('error');
    });

    test('should allow requests that are within the limit', async () => {
      const validScore = { playerName: 'RateOK', score: 100, level: 1 };

      const r1 = await request(app).post('/api/highscores').send(validScore);
      const r2 = await request(app).post('/api/highscores').send(validScore);

      expect(r1.status).toBe(201);
      expect(r2.status).toBe(201);
    });
  });

  describe('Error Handling', () => {
    test('should return 404 for unknown routes', async () => {
      const response = await request(app).get('/api/highscores/unknown/route');

      expect(response.status).toBe(404);
    });
  });
});
