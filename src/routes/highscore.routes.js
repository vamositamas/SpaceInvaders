const express = require('express');
const highScoreController = require('../controllers/highscore.controller');

const router = express.Router();

/**
 * @route   GET /api/highscores
 * @desc    Get all high scores (sorted by score descending)
 * @query   {number} limit - Optional limit for number of scores to return
 * @access  Public
 */
router.get('/', highScoreController.getAllHighScores.bind(highScoreController));

/**
 * @route   POST /api/highscores
 * @desc    Create a new high score
 * @body    {string} playerName - Player name (1-20 characters)
 * @body    {number} score - Score value (>= 0)
 * @body    {number} level - Level reached (>= 1)
 * @body    {number} [duration] - Optional game duration in seconds
 * @access  Public
 */
router.post('/', highScoreController.createHighScore.bind(highScoreController));

/**
 * @route   GET /api/highscores/:id
 * @desc    Get a specific high score by ID
 * @param   {string} id - High score ID
 * @access  Public
 */
router.get('/:id', highScoreController.getHighScoreById.bind(highScoreController));

/**
 * @route   DELETE /api/highscores/:id
 * @desc    Delete a high score by ID
 * @param   {string} id - High score ID
 * @access  Public
 */
router.delete('/:id', highScoreController.deleteHighScore.bind(highScoreController));

module.exports = router;
