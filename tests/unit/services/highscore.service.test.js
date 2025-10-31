const HighScoreService = require('../../../src/services/highscore.service');
const FileStorageService = require('../../../src/services/file-storage.service');

// Mock FileStorageService
jest.mock('../../../src/services/file-storage.service');

describe('HighScoreService', () => {
  let highScoreService;
  let mockFileStorage;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Create mock instance
    mockFileStorage = {
      readJSON: jest.fn(),
      writeJSON: jest.fn(),
    };

    // Mock the constructor
    FileStorageService.mockImplementation(() => mockFileStorage);

    // Create new service instance
    highScoreService = new HighScoreService();
  });

  describe('getAllHighScores', () => {
    test('should return empty array initially', async () => {
      mockFileStorage.readJSON.mockResolvedValue({ scores: [] });

      const scores = await highScoreService.getAllHighScores();

      expect(scores).toEqual([]);
      expect(Array.isArray(scores)).toBe(true);
    });

    test('should return all scores sorted by score descending', async () => {
      const mockScores = {
        scores: [
          { id: '1', playerName: 'Alice', score: 1000, level: 5, date: '2024-01-01' },
          { id: '2', playerName: 'Bob', score: 2000, level: 8, date: '2024-01-02' },
          { id: '3', playerName: 'Charlie', score: 1500, level: 6, date: '2024-01-03' },
        ],
      };
      mockFileStorage.readJSON.mockResolvedValue(mockScores);

      const scores = await highScoreService.getAllHighScores();

      expect(scores).toHaveLength(3);
      expect(scores[0].score).toBe(2000); // Bob first
      expect(scores[1].score).toBe(1500); // Charlie second
      expect(scores[2].score).toBe(1000); // Alice third
    });
  });

  describe('addHighScore', () => {
    beforeEach(() => {
      mockFileStorage.readJSON.mockResolvedValue({ scores: [] });
    });

    test('should add valid score and return it', async () => {
      mockFileStorage.writeJSON.mockResolvedValue();

      const scoreData = {
        playerName: 'Alice',
        score: 1500,
        level: 5,
        duration: 300,
      };

      const result = await highScoreService.addHighScore(scoreData);

      expect(result).toMatchObject(scoreData);
      expect(result.id).toBeDefined();
      expect(result.date).toBeDefined();
      expect(mockFileStorage.writeJSON).toHaveBeenCalled();
    });

    test('should generate unique ID for each score', async () => {
      mockFileStorage.writeJSON.mockResolvedValue();

      const score1 = await highScoreService.addHighScore({
        playerName: 'Alice',
        score: 1000,
        level: 1,
      });

      const score2 = await highScoreService.addHighScore({
        playerName: 'Bob',
        score: 2000,
        level: 2,
      });

      expect(score1.id).toBeDefined();
      expect(score2.id).toBeDefined();
      expect(score1.id).not.toBe(score2.id);
    });

    test('should reject negative score', async () => {
      await expect(
        highScoreService.addHighScore({
          playerName: 'Alice',
          score: -100,
          level: 1,
        })
      ).rejects.toThrow('Score must be a non-negative number');

      expect(mockFileStorage.writeJSON).not.toHaveBeenCalled();
    });

    test('should reject empty player name', async () => {
      await expect(
        highScoreService.addHighScore({
          playerName: '',
          score: 1000,
          level: 1,
        })
      ).rejects.toThrow('Player name must be between 1 and 20 characters');

      expect(mockFileStorage.writeJSON).not.toHaveBeenCalled();
    });

    test('should reject player name longer than 20 characters', async () => {
      await expect(
        highScoreService.addHighScore({
          playerName: 'ThisNameIsWayTooLongForTheGame',
          score: 1000,
          level: 1,
        })
      ).rejects.toThrow('Player name must be between 1 and 20 characters');
    });

    test('should reject invalid level', async () => {
      await expect(
        highScoreService.addHighScore({
          playerName: 'Alice',
          score: 1000,
          level: 0,
        })
      ).rejects.toThrow('Level must be an integer >= 1');
    });

    test('should keep maximum 100 scores (oldest removed)', async () => {
      // Create 100 existing scores
      const existingScores = [];
      for (let i = 1; i <= 100; i++) {
        existingScores.push({
          id: `score-${i}`,
          playerName: `Player${i}`,
          score: i * 100,
          level: i,
          date: new Date(2024, 0, i).toISOString(),
        });
      }

      mockFileStorage.readJSON.mockResolvedValue({ scores: existingScores });
      mockFileStorage.writeJSON.mockResolvedValue();

      // Add a new high score
      await highScoreService.addHighScore({
        playerName: 'NewPlayer',
        score: 15000,
        level: 50,
      });

      // Check that writeJSON was called with exactly 100 scores
      const writeCall = mockFileStorage.writeJSON.mock.calls[0];
      expect(writeCall[1].scores).toHaveLength(100);

      // The lowest score should have been removed
      const savedScores = writeCall[1].scores;
      const lowestScore = savedScores[savedScores.length - 1];
      expect(lowestScore.score).toBeGreaterThan(100); // First score (100) should be removed
    });
  });

  describe('getTopScores', () => {
    test('should return limited sorted results', async () => {
      const mockScores = {
        scores: [
          { id: '1', playerName: 'Alice', score: 1000, level: 5 },
          { id: '2', playerName: 'Bob', score: 3000, level: 10 },
          { id: '3', playerName: 'Charlie', score: 2000, level: 7 },
          { id: '4', playerName: 'David', score: 1500, level: 6 },
          { id: '5', playerName: 'Eve', score: 2500, level: 8 },
        ],
      };
      mockFileStorage.readJSON.mockResolvedValue(mockScores);

      const topThree = await highScoreService.getTopScores(3);

      expect(topThree).toHaveLength(3);
      expect(topThree[0].playerName).toBe('Bob'); // 3000
      expect(topThree[1].playerName).toBe('Eve'); // 2500
      expect(topThree[2].playerName).toBe('Charlie'); // 2000
    });

    test('should return all scores if limit exceeds total', async () => {
      mockFileStorage.readJSON.mockResolvedValue({
        scores: [
          { id: '1', playerName: 'Alice', score: 1000, level: 5 },
          { id: '2', playerName: 'Bob', score: 2000, level: 10 },
        ],
      });

      const topTen = await highScoreService.getTopScores(10);

      expect(topTen).toHaveLength(2);
    });
  });

  describe('isHighScore', () => {
    test('should return true if score qualifies for top 100', async () => {
      // Create 99 scores
      const existingScores = [];
      for (let i = 1; i <= 99; i++) {
        existingScores.push({
          id: `score-${i}`,
          playerName: `Player${i}`,
          score: i * 100,
          level: i,
        });
      }

      mockFileStorage.readJSON.mockResolvedValue({ scores: existingScores });

      const result = await highScoreService.isHighScore(5000);

      expect(result).toBe(true);
    });

    test('should return true if less than 100 scores exist', async () => {
      mockFileStorage.readJSON.mockResolvedValue({
        scores: [
          { id: '1', playerName: 'Alice', score: 1000, level: 5 },
        ],
      });

      const result = await highScoreService.isHighScore(500);

      expect(result).toBe(true);
    });

    test('should return false if score does not beat 100th place', async () => {
      // Create 100 scores
      const existingScores = [];
      for (let i = 1; i <= 100; i++) {
        existingScores.push({
          id: `score-${i}`,
          playerName: `Player${i}`,
          score: i * 100,
          level: i,
        });
      }

      mockFileStorage.readJSON.mockResolvedValue({ scores: existingScores });

      const result = await highScoreService.isHighScore(50); // Less than lowest score (100)

      expect(result).toBe(false);
    });

    test('should return true if score equals 100th place score', async () => {
      const existingScores = [];
      for (let i = 1; i <= 100; i++) {
        existingScores.push({
          id: `score-${i}`,
          playerName: `Player${i}`,
          score: 1000,
          level: i,
        });
      }

      mockFileStorage.readJSON.mockResolvedValue({ scores: existingScores });

      const result = await highScoreService.isHighScore(1000);

      expect(result).toBe(true);
    });
  });

  describe('clearAllScores', () => {
    test('should reset high score table', async () => {
      mockFileStorage.readJSON.mockResolvedValue({
        scores: [
          { id: '1', playerName: 'Alice', score: 1000, level: 5 },
        ],
      });
      mockFileStorage.writeJSON.mockResolvedValue();

      await highScoreService.clearAllScores();

      expect(mockFileStorage.writeJSON).toHaveBeenCalledWith(
        expect.any(String),
        { scores: [] }
      );
    });

    test('should return empty array after clearing', async () => {
      mockFileStorage.readJSON.mockResolvedValue({ scores: [] });
      mockFileStorage.writeJSON.mockResolvedValue();

      await highScoreService.clearAllScores();

      const scores = await highScoreService.getAllHighScores();
      expect(scores).toEqual([]);
    });
  });
});
