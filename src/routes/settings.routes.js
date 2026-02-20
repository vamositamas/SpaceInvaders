const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settings.controller');
const { validateNotEmpty } = require('../middleware/validation');

// GET /api/settings
router.get('/', settingsController.getSettings);

// PUT /api/settings
router.put('/', validateNotEmpty, settingsController.updateSettings);

// POST /api/settings/reset
router.post('/reset', settingsController.resetSettings);

module.exports = router;
