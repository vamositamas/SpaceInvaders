const path = require('path');
const { randomUUID } = require('crypto');
const FileStorageService = require('./file-storage.service');
const { validateHighScore } = require('../models/schemas');

/**
 * HighScoreService - Manages high score persistence and validation
 */
class HighScoreService {
  constructor() {
    this.fileStorage = new FileStorageService();
    // Use /tmp on Vercel/serverless, local data directory otherwise
    const dataDir = process.env.VERCEL ? '/tmp' : path.join(__dirname, '../../data/highscores');
    this.highScoresPath = path.join(dataDir, 'highscores.json');
    this.MAX_SCORES = 100;
  }

  /**
   * Loads high scores from file
   * @private
   * @returns {Promise<Array>} Array of high scores
   */
  async _loadScores() {
    try {
      const data = await this.fileStorage.readJSON(this.highScoresPath);
      return data.scores || [];
    } catch (error) {
      // If file doesn't exist or is invalid, return empty array
      return [];
    }
  }

  /**
   * Saves high scores to file
   * @private
   * @param {Array} scores - Array of high scores
   * @returns {Promise<void>}
   */
  async _saveScores(scores) {
    await this.fileStorage.writeJSON(this.highScoresPath, { scores });
  }

  /**
   * Sorts scores by score descending
   * @private
   * @param {Array} scores - Array of scores to sort
   * @returns {Array} Sorted scores
   */
  _sortScores(scores) {
    return scores.sort((a, b) => b.score - a.score);
  }

  /**
   * Gets all high scores sorted by score descending
   * @returns {Promise<Array>} Sorted array of all high scores
   */
  async getAllHighScores() {
    const scores = await this._loadScores();
    return this._sortScores([...scores]);
  }

  /**
   * Adds a new high score with validation
   * @param {object} scoreData - Score data to add
   * @param {string} scoreData.playerName - Player name (1-20 chars)
   * @param {number} scoreData.score - Score (>= 0)
   * @param {number} scoreData.level - Level reached (>= 1)
   * @param {number} [scoreData.duration] - Game duration in seconds
   * @returns {Promise<object>} Added high score with generated id and date
   * @throws {Error} If validation fails
   */
  async addHighScore(scoreData) {
    // Validate the score data
    validateHighScore(scoreData);

    // Load existing scores
    const scores = await this._loadScores();

    // Create new score entry
    const newScore = {
      id: randomUUID(),
      playerName: scoreData.playerName,
      score: scoreData.score,
      level: scoreData.level,
      date: new Date().toISOString(),
    };

    // Add optional fields
    if (scoreData.duration !== undefined) {
      newScore.duration = scoreData.duration;
    }

    // Add to scores array
    scores.push(newScore);

    // Sort scores by score descending
    const sortedScores = this._sortScores(scores);

    // Keep only top 100 scores
    const limitedScores = sortedScores.slice(0, this.MAX_SCORES);

    // Save back to file
    await this._saveScores(limitedScores);

    return newScore;
  }

  /**
   * Gets top N high scores
   * @param {number} limit - Number of scores to return
   * @returns {Promise<Array>} Top N scores sorted by score descending
   */
  async getTopScores(limit) {
    const scores = await this.getAllHighScores();
    return scores.slice(0, limit);
  }

  /**
   * Checks if a score qualifies for the top 100
   * @param {number} score - Score to check
   * @returns {Promise<boolean>} True if score qualifies for top 100
   */
  async isHighScore(score) {
    const scores = await this._loadScores();

    // If less than 100 scores, any score qualifies
    if (scores.length < this.MAX_SCORES) {
      return true;
    }

    // Sort scores and check if new score beats the 100th score
    const sortedScores = this._sortScores([...scores]);
    const lowestScore = sortedScores[this.MAX_SCORES - 1];

    return score >= lowestScore.score;
  }

  /**
   * Gets a specific high score by ID
   * @param {string} id - Score ID to retrieve
   * @returns {Promise<object|null>} Score object or null if not found
   */
  async getScoreById(id) {
    const scores = await this._loadScores();
    return scores.find((score) => score.id === id) || null;
  }

  /**
   * Deletes a high score by ID
   * @param {string} id - Score ID to delete
   * @returns {Promise<boolean>} True if score was deleted, false if not found
   */
  async deleteScore(id) {
    const scores = await this._loadScores();
    const initialLength = scores.length;
    const filteredScores = scores.filter((score) => score.id !== id);

    // If length didn't change, score wasn't found
    if (filteredScores.length === initialLength) {
      return false;
    }

    await this._saveScores(filteredScores);
    return true;
  }

  /**
   * Clears all high scores (for testing)
   * @returns {Promise<void>}
   */
  async clearAllScores() {
    await this._saveScores([]);
  }
}

module.exports = HighScoreService;
