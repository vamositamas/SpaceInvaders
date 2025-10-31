const ConfigService = require('../services/config.service');

// Create a single instance to maintain state
const configService = new ConfigService();

// Initialize config on startup
let configInitialized = false;

async function ensureConfigLoaded() {
  if (!configInitialized) {
    await configService.loadConfig();
    configInitialized = true;
  }
}

/**
 * GET /api/config
 * Returns current configuration
 */
async function getConfig(req, res, next) {
  try {
    await ensureConfigLoaded();
    const config = configService.getConfig();
    res.json(config);
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/config
 * Updates configuration
 */
async function updateConfig(req, res, next) {
  try {
    await ensureConfigLoaded();
    const updates = req.body;
    const updatedConfig = await configService.updateConfig(updates);
    res.json(updatedConfig);
  } catch (error) {
    // Validation errors should return 400
    if (error.message.includes('must be') || 
        error.message.includes('required') ||
        error.message.includes('invalid')) {
      return res.status(400).json({
        error: error.message,
      });
    }
    next(error);
  }
}

/**
 * POST /api/config/reset
 * Resets configuration to defaults
 */
async function resetConfig(req, res, next) {
  try {
    const defaultConfig = await configService.resetToDefault();
    res.json(defaultConfig);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getConfig,
  updateConfig,
  resetConfig,
};
