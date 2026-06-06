const path = require('path');
const { randomUUID } = require('crypto');
const FileStorageService = require('./file-storage.service');

const MAX_SESSIONS = 100;

/**
 * SessionService — tracks game sessions for analytics and debugging.
 *
 * Each session records:
 *   - id           unique UUID
 *   - playerId     identifier supplied by the caller
 *   - startTime    Unix ms timestamp
 *   - endTime      Unix ms timestamp (set on completion)
 *   - duration     total seconds (set on completion)
 *   - status       'active' | 'completed'
 *   - currentScore latest score from updateSession()
 *   - currentLevel latest level from updateSession()
 *   - finalScore   score recorded when endSession() is called
 *
 * Sessions are persisted to data/logs/game-sessions.json and capped at
 * MAX_SESSIONS (oldest removed when the cap is exceeded).
 */
class SessionService {
  constructor() {
    this.fileStorage = new FileStorageService();
    // Session logs need writable storage - use /tmp on Vercel
    const dataDir = process.env.VERCEL ? '/tmp' : path.join(__dirname, '../../data/logs');
    this.sessionsPath = path.join(dataDir, 'game-sessions.json');
    // In-memory copy — loaded lazily on first access
    this._sessions = null;
  }

  // ── Private helpers ────────────────────────────────────────────────────

  async _load() {
    if (this._sessions !== null) return;
    try {
      const data = await this.fileStorage.readJSON(this.sessionsPath);
      this._sessions = Array.isArray(data.sessions) ? data.sessions : [];
    } catch {
      this._sessions = [];
    }
  }

  async _save() {
    // Keep only the most recent MAX_SESSIONS sessions
    const trimmed = this._sessions.slice(-MAX_SESSIONS);
    this._sessions = trimmed;
    await this.fileStorage.writeJSON(this.sessionsPath, { sessions: trimmed });
  }

  _find(id) {
    return this._sessions.find(s => s.id === id) || null;
  }

  // ── Public API ─────────────────────────────────────────────────────────

  /**
   * Start a new game session.
   * @param {string} playerId
   * @returns {Promise<object>} The created session
   */
  async createSession(playerId) {
    await this._load();

    const session = {
      id: randomUUID(),
      playerId,
      startTime: Date.now(),
      status: 'active',
      currentScore: 0,
      currentLevel: 1,
      finalScore: null,
      endTime: null,
      duration: null,
    };

    this._sessions.push(session);
    await this._save();
    return { ...session };
  }

  /**
   * Update an active session with the latest game state.
   * @param {string} sessionId
   * @param {{ score?: number, level?: number }} gameState
   * @returns {Promise<object|null>} Updated session, or null if not found
   */
  async updateSession(sessionId, gameState) {
    await this._load();

    const session = this._find(sessionId);
    if (!session) return null;

    if (gameState.score !== undefined) session.currentScore = gameState.score;
    if (gameState.level !== undefined) session.currentLevel = gameState.level;

    await this._save();
    return { ...session };
  }

  /**
   * Mark a session as completed and record the final score.
   * @param {string} sessionId
   * @param {number} finalScore
   * @returns {Promise<object|null>} Completed session, or null if not found
   */
  async endSession(sessionId, finalScore) {
    await this._load();

    const session = this._find(sessionId);
    if (!session) return null;

    const endTime = Date.now();
    session.status = 'completed';
    session.finalScore = finalScore;
    session.endTime = endTime;
    session.duration = (endTime - session.startTime) / 1000;

    await this._save();
    return { ...session };
  }

  /**
   * Compute aggregate statistics over all stored sessions.
   * @returns {Promise<object>} Stats object
   */
  async getSessionStats() {
    await this._load();

    const total = this._sessions.length;
    const completed = this._sessions.filter(s => s.status === 'completed');

    if (completed.length === 0) {
      return {
        totalSessions: total,
        completedSessions: 0,
        averageScore: 0,
        averageDuration: 0,
        highestScore: 0,
      };
    }

    const scores = completed.map(s => s.finalScore ?? 0);
    const durations = completed.map(s => s.duration ?? 0);

    return {
      totalSessions: total,
      completedSessions: completed.length,
      averageScore: scores.reduce((a, b) => a + b, 0) / completed.length,
      averageDuration: durations.reduce((a, b) => a + b, 0) / completed.length,
      highestScore: Math.max(...scores),
    };
  }
}

module.exports = SessionService;
