const express = require('express');
const highScoreController = require('../controllers/highscore.controller');
const RateLimiter = require('../middleware/rate-limiter');

const router = express.Router();

// 20 submissions per hour per IP (production default; configurable for tests)
const scoreRateLimiter = new RateLimiter({ max: 20, windowMs: 60 * 60 * 1000 });

/**
 * @openapi
 * /api/highscores:
 *   get:
 *     summary: Retrieve all high scores
 *     tags: [Highscores]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Limit number of results
 *     responses:
 *       200:
 *         description: List of high scores
 *   post:
 *     summary: Create a new high score
 *     tags: [Highscores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - playerName
 *               - score
 *               - level
 *             properties:
 *               playerName:
 *                 type: string
 *               score:
 *                 type: integer
 *               level:
 *                 type: integer
 *               duration:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Created score JSON
 *       400:
 *         description: Validation error
 */
router.get('/', highScoreController.getAllHighScores.bind(highScoreController));

router.post(
  '/',
  (req, res, next) => scoreRateLimiter.middleware(req, res, next),
  highScoreController.createHighScore.bind(highScoreController)
);

/**
 * @openapi
 * /api/highscores/{id}:
 *   get:
 *     summary: Get a specific score by ID
 *     tags: [Highscores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Score details JSON
 *       404:
 *         description: Score not found
 *   delete:
 *     summary: Delete score by ID
 *     tags: [Highscores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Score deleted successfully
 *       404:
 *         description: Score not found
 */
router.get('/:id', highScoreController.getHighScoreById.bind(highScoreController));

router.delete('/:id', highScoreController.deleteHighScore.bind(highScoreController));

module.exports = router;
module.exports.scoreRateLimiter = scoreRateLimiter;
