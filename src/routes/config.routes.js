const express = require('express');
const router = express.Router();
const configController = require('../controllers/config.controller');
const { validateNotEmpty } = require('../middleware/validation');

// GET /api/config - Get current configuration
router.get('/', configController.getConfig);

// PUT /api/config - Update configuration
router.put('/', validateNotEmpty, configController.updateConfig);

// POST /api/config/reset - Reset to default configuration
router.post('/reset', configController.resetConfig);

module.exports = router;
