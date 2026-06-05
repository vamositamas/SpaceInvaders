const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settings.controller');
const { validateNotEmpty } = require('../middleware/validation');

/**
 * @openapi
 * /api/settings:
 *   get:
 *     summary: Retrieve player settings
 *     tags: [Settings]
 *     responses:
 *       200:
 *         description: Active settings JSON
 *   put:
 *     summary: Save player settings
 *     tags: [Settings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Updated settings JSON
 *       400:
 *         description: Validation error
 * /api/settings/reset:
 *   post:
 *     summary: Reset player settings to default values
 *     tags: [Settings]
 *     responses:
 *       200:
 *         description: Default settings JSON
 */

// GET /api/settings
router.get('/', settingsController.getSettings);

// PUT /api/settings
router.put('/', validateNotEmpty, settingsController.updateSettings);

// POST /api/settings/reset
router.post('/reset', settingsController.resetSettings);

module.exports = router;
