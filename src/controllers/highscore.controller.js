const HighScoreService = require('../services/highscore.service');

// Create singleton instance
const highScoreService = new HighScoreService();

/**
 * HighScore Controller - Handles high score HTTP requests
 */
class HighScoreController {
  /**
   * GET /api/highscores?limit=10
   * Get all high scores with optional limit
   */
  async getAllHighScores(req, res, next) {
    try {
      const { limit } = req.query;

      // Validate limit if provided
      if (limit !== undefined) {
        const limitNum = parseInt(limit, 10);
        
        if (isNaN(limitNum)) {
          return res.status(400).json({
            error: 'Invalid limit parameter. Must be a valid number.',
          });
        }

        if (limitNum < 1) {
          return res.status(400).json({
            error: 'Invalid limit parameter. Must be greater than 0.',
          });
        }

        const scores = await highScoreService.getTopScores(limitNum);
        return res.json(scores);
      }

      // No limit specified, return all scores
      const scores = await highScoreService.getAllHighScores();
      res.json(scores);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/highscores
   * Create a new high score
   */
  async createHighScore(req, res, next) {
    try {
      const { playerName, score, level, duration } = req.body;

      // Basic validation for required fields
      if (!playerName || score === undefined || level === undefined) {
        return res.status(400).json({
          error: 'Missing required fields: playerName, score, and level are required.',
        });
      }

      const scoreData = { playerName, score, level };
      if (duration !== undefined) {
        scoreData.duration = duration;
      }

      const newScore = await highScoreService.addHighScore(scoreData);
      res.status(201).json(newScore);
    } catch (error) {
      // Handle validation errors from the service
      if (error.message.includes('must') || error.message.includes('required')) {
        return res.status(400).json({ error: error.message });
      }
      next(error);
    }
  }

  /**
   * GET /api/highscores/:id
   * Get a specific high score by ID
   */
  async getHighScoreById(req, res, next) {
    try {
      const { id } = req.params;
      const score = await highScoreService.getScoreById(id);

      if (!score) {
        return res.status(404).json({
          error: `High score with id '${id}' not found.`,
        });
      }

      res.json(score);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/highscores/:id
   * Delete a high score by ID
   */
  async deleteHighScore(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await highScoreService.deleteScore(id);

      if (!deleted) {
        return res.status(404).json({
          error: `High score with id '${id}' not found.`,
        });
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new HighScoreController();
