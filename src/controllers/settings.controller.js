const SettingsService = require('../services/settings.service');

const settingsService = new SettingsService();

async function ensureLoaded() {
  try {
    settingsService.getSettings(); // throws if not loaded
  } catch {
    await settingsService.loadSettings();
  }
}

/**
 * GET /api/settings
 */
async function getSettings(req, res, next) {
  try {
    await ensureLoaded();
    res.json(settingsService.getSettings());
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/settings
 */
async function updateSettings(req, res, next) {
  try {
    await ensureLoaded();
    const updated = await settingsService.updateSettings(req.body);
    res.json(updated);
  } catch (error) {
    if (
      error.message.includes('must be') ||
      error.message.includes('between') ||
      error.message.includes('one of')
    ) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
}

/**
 * POST /api/settings/reset
 */
async function resetSettings(req, res, next) {
  try {
    const defaults = await settingsService.resetToDefault();
    res.json(defaults);
  } catch (error) {
    next(error);
  }
}

module.exports = { getSettings, updateSettings, resetSettings };
