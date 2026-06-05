const express = require('express');
const router = express.Router();
const configController = require('../controllers/config.controller');
const { validateNotEmpty } = require('../middleware/validation');

/**
 * @openapi
 * /api/config:
 *   get:
 *     summary: Retrieve active game configuration
 *     tags: [Config]
 *     responses:
 *       200:
 *         description: Active configuration JSON
 *   put:
 *     summary: Update game configuration
 *     tags: [Config]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Updated configuration JSON
 *       400:
 *         description: Validation error
 * /api/config/reset:
 *   post:
 *     summary: Reset game configuration to default values
 *     tags: [Config]
 *     responses:
 *       200:
 *         description: Default configuration JSON
 */

// GET /api/config - Get current configuration
router.get('/', configController.getConfig);

// PUT /api/config - Update configuration
router.put('/', validateNotEmpty, configController.updateConfig);

// POST /api/config/reset - Reset to default configuration
router.post('/reset', configController.resetConfig);

module.exports = router;
