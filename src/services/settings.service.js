const path = require('path');
const FileStorageService = require('./file-storage.service');

const VALID_DIFFICULTIES = ['EASY', 'NORMAL', 'HARD'];
const VALID_CONTROL_SCHEMES = ['KEYBOARD', 'MOUSE'];

/**
 * Validates a settings object.
 * @param {object} settings
 * @throws {Error} if any field is invalid
 */
function validateSettings(settings) {
  if (settings.hasOwnProperty('soundEnabled') && typeof settings.soundEnabled !== 'boolean') {
    throw new Error('soundEnabled must be a boolean');
  }
  if (settings.hasOwnProperty('musicEnabled') && typeof settings.musicEnabled !== 'boolean') {
    throw new Error('musicEnabled must be a boolean');
  }
  if (settings.hasOwnProperty('volume')) {
    if (typeof settings.volume !== 'number' || settings.volume < 0 || settings.volume > 100) {
      throw new Error('volume must be between 0 and 100');
    }
  }
  if (settings.hasOwnProperty('difficulty')) {
    if (!VALID_DIFFICULTIES.includes(settings.difficulty)) {
      throw new Error(`difficulty must be one of: ${VALID_DIFFICULTIES.join(', ')}`);
    }
  }
  if (settings.hasOwnProperty('controlScheme')) {
    if (!VALID_CONTROL_SCHEMES.includes(settings.controlScheme)) {
      throw new Error(`controlScheme must be one of: ${VALID_CONTROL_SCHEMES.join(', ')}`);
    }
  }
}

/**
 * Validates a complete settings object (all fields required).
 * @param {object} settings
 * @returns {boolean}
 */
function isCompleteSettings(settings) {
  if (!settings || typeof settings !== 'object') return false;
  return (
    typeof settings.soundEnabled === 'boolean' &&
    typeof settings.musicEnabled === 'boolean' &&
    typeof settings.volume === 'number' &&
    settings.volume >= 0 &&
    settings.volume <= 100 &&
    VALID_DIFFICULTIES.includes(settings.difficulty) &&
    VALID_CONTROL_SCHEMES.includes(settings.controlScheme)
  );
}

/**
 * SettingsService — manages player settings with file persistence.
 */
class SettingsService {
  constructor() {
    this.fileStorage = new FileStorageService();
    // Default settings is read-only, use local path
    this.defaultSettingsPath = path.join(__dirname, '../../data/settings/default-settings.json');
    // User settings needs writable storage - use /tmp on Vercel
    const dataDir = process.env.VERCEL ? '/tmp' : path.join(__dirname, '../../data/settings');
    this.settingsPath = path.join(dataDir, 'settings.json');
    this.currentSettings = null;
  }

  /**
   * Loads settings from file. Falls back to defaults if file is missing or invalid.
   * @returns {Promise<object>}
   */
  async loadSettings() {
    try {
      const loaded = await this.fileStorage.readJSON(this.settingsPath);

      if (isCompleteSettings(loaded)) {
        this.currentSettings = loaded;
        return { ...this.currentSettings };
      }

      // Invalid — fall back to defaults
      console.warn('Stored settings are invalid, using defaults');
      return await this._loadDefaults();
    } catch (error) {
      if (error.message.includes('File not found')) {
        return await this._loadDefaults();
      }
      throw error;
    }
  }

  /**
   * Returns current settings snapshot.
   * @returns {object}
   * @throws {Error} if settings not yet loaded
   */
  getSettings() {
    if (!this.currentSettings) {
      throw new Error('Settings not loaded. Call loadSettings() first.');
    }
    return { ...this.currentSettings };
  }

  /**
   * Merges partial updates into current settings and persists to file.
   * @param {object} updates
   * @returns {Promise<object>}
   */
  async updateSettings(updates) {
    if (!this.currentSettings) {
      throw new Error('Settings not loaded. Call loadSettings() first.');
    }

    // Validate the incoming partial update
    validateSettings(updates);

    const merged = { ...this.currentSettings, ...updates };
    await this.fileStorage.writeJSON(this.settingsPath, merged);
    this.currentSettings = merged;
    return { ...merged };
  }

  /**
   * Resets settings to defaults and persists to file.
   * @returns {Promise<object>}
   */
  async resetToDefault() {
    const defaults = await this._loadDefaults();
    await this.fileStorage.writeJSON(this.settingsPath, defaults);
    this.currentSettings = defaults;
    return { ...defaults };
  }

  // ── Private ─────────────────────────────────────────────────────────────

  async _loadDefaults() {
    const defaults = await this.fileStorage.readJSON(this.defaultSettingsPath);
    this.currentSettings = defaults;
    return { ...defaults };
  }
}

module.exports = SettingsService;
