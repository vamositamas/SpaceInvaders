const path = require('path');
const FileStorageService = require('./file-storage.service');
const { validateConfig } = require('../models/schemas');

/**
 * ConfigService - Manages game configuration with validation
 */
class ConfigService {
  constructor() {
    this.fileStorage = new FileStorageService();
    // Default config is read-only, use local path
    this.defaultConfigPath = path.join(__dirname, '../../data/config/default-config.json');
    // User config needs writable storage - use /tmp on Vercel
    const dataDir = process.env.VERCEL ? '/tmp' : path.join(__dirname, '../../data/config');
    this.configPath = path.join(dataDir, 'game-config.json');
    this.currentConfig = null;
  }

  /**
   * Loads configuration from file or returns default
   * @returns {Promise<object>} Configuration object
   */
  async loadConfig() {
    try {
      // Try to load existing config
      const config = await this.fileStorage.readJSON(this.configPath);
      
      // Validate loaded config
      try {
        validateConfig(config);
        this.currentConfig = config;
        return config;
      } catch (validationError) {
        // If validation fails, load default config
        console.warn('Loaded config is invalid, using default:', validationError.message);
        return await this._loadDefaultConfig();
      }
    } catch (error) {
      // If file doesn't exist, load default config
      if (error.message.includes('File not found')) {
        return await this._loadDefaultConfig();
      }
      throw error;
    }
  }

  /**
   * Loads default configuration
   * @private
   * @returns {Promise<object>} Default configuration
   */
  async _loadDefaultConfig() {
    const defaultConfig = await this.fileStorage.readJSON(this.defaultConfigPath);
    this.currentConfig = defaultConfig;
    return defaultConfig;
  }

  /**
   * Returns current configuration
   * @returns {object} Current configuration
   * @throws {Error} If configuration not loaded
   */
  getConfig() {
    if (!this.currentConfig) {
      throw new Error('Configuration not loaded. Call loadConfig() first.');
    }
    return { ...this.currentConfig };
  }

  /**
   * Updates configuration with partial updates
   * @param {object} updates - Partial configuration updates
   * @returns {Promise<object>} Updated configuration
   * @throws {Error} If configuration not loaded or validation fails
   */
  async updateConfig(updates) {
    if (!this.currentConfig) {
      throw new Error('Configuration not loaded. Call loadConfig() first.');
    }

    // Deep merge updates with current config
    const updatedConfig = this._deepMerge(this.currentConfig, updates);

    // Validate complete merged config
    validateConfig(updatedConfig, true);

    // Save to file
    await this.fileStorage.writeJSON(this.configPath, updatedConfig);

    // Update current config
    this.currentConfig = updatedConfig;

    return { ...updatedConfig };
  }

  /**
   * Resets configuration to default
   * @returns {Promise<object>} Default configuration
   */
  async resetToDefault() {
    const defaultConfig = await this.fileStorage.readJSON(this.defaultConfigPath);
    
    // Save default config to game config file
    await this.fileStorage.writeJSON(this.configPath, defaultConfig);
    
    // Update current config
    this.currentConfig = defaultConfig;
    
    return { ...defaultConfig };
  }

  /**
   * Deep merges two objects
   * @private
   * @param {object} target - Target object
   * @param {object} source - Source object
   * @returns {object} Merged object
   */
  _deepMerge(target, source) {
    const result = { ...target };

    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (
          source[key] &&
          typeof source[key] === 'object' &&
          !Array.isArray(source[key]) &&
          target[key] &&
          typeof target[key] === 'object' &&
          !Array.isArray(target[key])
        ) {
          // Recursively merge nested objects
          result[key] = this._deepMerge(target[key], source[key]);
        } else {
          // Direct assignment for primitives and arrays
          result[key] = source[key];
        }
      }
    }

    return result;
  }
}

module.exports = ConfigService;
