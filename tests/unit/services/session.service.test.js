const SessionService = require('../../../src/services/session.service');
const FileStorageService = require('../../../src/services/file-storage.service');

jest.mock('../../../src/services/file-storage.service');

describe('SessionService', () => {
  let service;
  let mockFileStorage;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    mockFileStorage = {
      readJSON: jest.fn().mockResolvedValue({ sessions: [] }),
      writeJSON: jest.fn().mockResolvedValue(undefined),
    };
    FileStorageService.mockImplementation(() => mockFileStorage);

    service = new SessionService();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // ── createSession ─────────────────────────────────────────────────────────

  describe('createSession', () => {
    test('should return a session with a unique ID', async () => {
      const s1 = await service.createSession('player1');
      const s2 = await service.createSession('player2');
      expect(s1.id).toBeDefined();
      expect(s2.id).toBeDefined();
      expect(s1.id).not.toBe(s2.id);
    });

    test('should store the start timestamp', async () => {
      const before = Date.now();
      const session = await service.createSession('player1');
      const after = Date.now();
      expect(session.startTime).toBeGreaterThanOrEqual(before);
      expect(session.startTime).toBeLessThanOrEqual(after);
    });

    test('should set initial status to active', async () => {
      const session = await service.createSession('player1');
      expect(session.status).toBe('active');
    });

    test('should store playerId', async () => {
      const session = await service.createSession('player1');
      expect(session.playerId).toBe('player1');
    });

    test('should persist the new session to file', async () => {
      await service.createSession('player1');
      expect(mockFileStorage.writeJSON).toHaveBeenCalled();
    });
  });

  // ── updateSession ─────────────────────────────────────────────────────────

  describe('updateSession', () => {
    test('should update the session with provided game state', async () => {
      const session = await service.createSession('player1');
      const updated = await service.updateSession(session.id, { score: 500, level: 2 });
      expect(updated.currentScore).toBe(500);
      expect(updated.currentLevel).toBe(2);
    });

    test('should return null for non-existent session ID', async () => {
      const result = await service.updateSession('non-existent-id', { score: 100 });
      expect(result).toBeNull();
    });

    test('should persist updated session to file', async () => {
      const session = await service.createSession('player1');
      mockFileStorage.writeJSON.mockClear();
      await service.updateSession(session.id, { score: 100 });
      expect(mockFileStorage.writeJSON).toHaveBeenCalled();
    });
  });

  // ── endSession ────────────────────────────────────────────────────────────

  describe('endSession', () => {
    test('should mark session as completed', async () => {
      const session = await service.createSession('player1');
      const ended = await service.endSession(session.id, 1000);
      expect(ended.status).toBe('completed');
    });

    test('should store the final score', async () => {
      const session = await service.createSession('player1');
      const ended = await service.endSession(session.id, 1500);
      expect(ended.finalScore).toBe(1500);
    });

    test('should record end time', async () => {
      const session = await service.createSession('player1');
      const before = Date.now();
      const ended = await service.endSession(session.id, 500);
      const after = Date.now();
      expect(ended.endTime).toBeGreaterThanOrEqual(before);
      expect(ended.endTime).toBeLessThanOrEqual(after);
    });

    test('should calculate duration in seconds', async () => {
      const session = await service.createSession('player1');
      // Advance fake timer by 30 seconds
      jest.advanceTimersByTime(30000);
      const ended = await service.endSession(session.id, 1000);
      expect(ended.duration).toBeGreaterThanOrEqual(30);
    });

    test('should return null for non-existent session ID', async () => {
      const result = await service.endSession('non-existent-id', 1000);
      expect(result).toBeNull();
    });

    test('should persist completed session to file', async () => {
      const session = await service.createSession('player1');
      mockFileStorage.writeJSON.mockClear();
      await service.endSession(session.id, 1000);
      expect(mockFileStorage.writeJSON).toHaveBeenCalled();
    });
  });

  // ── getSessionStats ───────────────────────────────────────────────────────

  describe('getSessionStats', () => {
    test('should return zero stats when no sessions exist', async () => {
      const stats = await service.getSessionStats();
      expect(stats.totalSessions).toBe(0);
      expect(stats.completedSessions).toBe(0);
      expect(stats.averageScore).toBe(0);
      expect(stats.averageDuration).toBe(0);
    });

    test('should count total and completed sessions', async () => {
      const s1 = await service.createSession('p1');
      const s2 = await service.createSession('p2');
      await service.endSession(s1.id, 1000);
      // s2 left active

      const stats = await service.getSessionStats();
      expect(stats.totalSessions).toBe(2);
      expect(stats.completedSessions).toBe(1);
    });

    test('should calculate average score across completed sessions', async () => {
      const s1 = await service.createSession('p1');
      const s2 = await service.createSession('p2');
      await service.endSession(s1.id, 1000);
      await service.endSession(s2.id, 3000);

      const stats = await service.getSessionStats();
      expect(stats.averageScore).toBe(2000);
    });

    test('should calculate average duration across completed sessions', async () => {
      const s1 = await service.createSession('p1');
      jest.advanceTimersByTime(60000);
      await service.endSession(s1.id, 500);

      const stats = await service.getSessionStats();
      expect(stats.averageDuration).toBeGreaterThanOrEqual(60);
    });

    test('should return highest score', async () => {
      const s1 = await service.createSession('p1');
      const s2 = await service.createSession('p2');
      await service.endSession(s1.id, 500);
      await service.endSession(s2.id, 2000);

      const stats = await service.getSessionStats();
      expect(stats.highestScore).toBe(2000);
    });
  });

  // ── auto-cleanup ──────────────────────────────────────────────────────────

  describe('Auto-cleanup', () => {
    test('should keep only the last 100 sessions', async () => {
      // Simulate 105 sessions already saved to file
      const existing = Array.from({ length: 105 }, (_, i) => ({
        id: `session-${i}`,
        playerId: `player${i}`,
        startTime: Date.now() - i * 1000,
        status: 'completed',
        finalScore: i * 10,
      }));
      mockFileStorage.readJSON.mockResolvedValue({ sessions: existing });

      // Reinitialise service so it reads the pre-populated file
      service = new SessionService();

      const newSession = await service.createSession('new-player');

      // Check that writeJSON was called with at most 100 sessions
      const writeCall = mockFileStorage.writeJSON.mock.calls.at(-1);
      const saved = writeCall[1].sessions;
      expect(saved.length).toBeLessThanOrEqual(100);
    });
  });
});
