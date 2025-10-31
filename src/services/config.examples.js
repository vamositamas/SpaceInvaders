/**
 * Usage examples for ConfigService
 * 
 * This file demonstrates how to use the ConfigService
 * for managing game configuration.
 */

const ConfigService = require('./config.service');

// Create an instance of the service
const configService = new ConfigService();

// Example 1: Load configuration on application startup
async function initializeGame() {
  try {
    // Load config from file or get default
    const config = await configService.loadConfig();
    console.log('Game configuration loaded:', config);
    
    // Access specific settings
    console.log(`Canvas size: ${config.canvas.width}x${config.canvas.height}`);
    console.log(`Player lives: ${config.player.lives}`);
    console.log(`Difficulty levels available:`, Object.keys(config.difficulty));
    
    return config;
  } catch (error) {
    console.error('Failed to load configuration:', error.message);
    throw error;
  }
}

// Example 2: Get current configuration
async function displayCurrentSettings() {
  try {
    const config = configService.getConfig();
    console.log('Current settings:', JSON.stringify(config, null, 2));
  } catch (error) {
    console.error('Configuration not loaded:', error.message);
  }
}

// Example 3: Update player settings
async function updatePlayerLives(newLives) {
  try {
    const updatedConfig = await configService.updateConfig({
      player: { lives: newLives },
    });
    console.log(`Player lives updated to: ${updatedConfig.player.lives}`);
  } catch (error) {
    console.error('Failed to update player lives:', error.message);
  }
}

// Example 4: Update canvas size
async function setCanvasSize(width, height) {
  try {
    await configService.updateConfig({
      canvas: { width, height },
    });
    console.log(`Canvas size updated to: ${width}x${height}`);
  } catch (error) {
    console.error('Failed to update canvas size:', error.message);
  }
}

// Example 5: Update multiple settings at once
async function adjustDifficulty(difficultyName) {
  try {
    const config = configService.getConfig();
    const difficultySettings = config.difficulty[difficultyName];
    
    if (!difficultySettings) {
      throw new Error(`Unknown difficulty: ${difficultyName}`);
    }
    
    console.log(`Applying ${difficultyName} difficulty:`, difficultySettings);
    
    // Update enemy speed and fire rate based on difficulty
    await configService.updateConfig({
      enemies: {
        baseSpeed: config.enemies.baseSpeed * difficultySettings.speedMultiplier,
        fireRate: config.enemies.fireRate * difficultySettings.fireRateMultiplier,
      },
    });
    
    console.log(`Game difficulty set to: ${difficultyName}`);
  } catch (error) {
    console.error('Failed to adjust difficulty:', error.message);
  }
}

// Example 6: Reset to default settings
async function resetGameSettings() {
  try {
    const defaultConfig = await configService.resetToDefault();
    console.log('Configuration reset to defaults');
    console.log('Default player lives:', defaultConfig.player.lives);
  } catch (error) {
    console.error('Failed to reset configuration:', error.message);
  }
}

// Example 7: Validate before updating
async function safeUpdateConfig(updates) {
  try {
    // The service will validate automatically
    await configService.updateConfig(updates);
    console.log('Configuration updated successfully');
  } catch (error) {
    if (error.message.includes('must be a positive')) {
      console.error('Invalid value: Values must be positive numbers');
    } else if (error.message.includes('must be an object')) {
      console.error('Invalid structure: Expected an object');
    } else {
      console.error('Validation error:', error.message);
    }
  }
}

// Example 8: Get difficulty-adjusted values
async function getEnemySpeedForDifficulty(difficultyName) {
  try {
    const config = configService.getConfig();
    const difficulty = config.difficulty[difficultyName];
    
    if (!difficulty) {
      throw new Error(`Unknown difficulty: ${difficultyName}`);
    }
    
    const adjustedSpeed = config.enemies.baseSpeed * difficulty.speedMultiplier;
    const adjustedFireRate = config.enemies.fireRate * difficulty.fireRateMultiplier;
    
    return {
      speed: adjustedSpeed,
      fireRate: adjustedFireRate,
    };
  } catch (error) {
    console.error('Error calculating difficulty values:', error.message);
    return null;
  }
}

// Example 9: Bulk updates with error handling
async function updateGameSettings(settings) {
  const updates = {};
  
  // Build updates object from individual settings
  if (settings.canvasWidth && settings.canvasHeight) {
    updates.canvas = {
      width: settings.canvasWidth,
      height: settings.canvasHeight,
    };
  }
  
  if (settings.playerSpeed) {
    updates.player = { speed: settings.playerSpeed };
  }
  
  if (settings.enemyRows || settings.enemyColumns) {
    updates.enemies = {};
    if (settings.enemyRows) updates.enemies.rows = settings.enemyRows;
    if (settings.enemyColumns) updates.enemies.columns = settings.enemyColumns;
  }
  
  try {
    await configService.updateConfig(updates);
    console.log('Game settings updated successfully');
  } catch (error) {
    console.error('Failed to update game settings:', error.message);
    throw error;
  }
}

// Example 10: Export current config for sharing
async function exportConfiguration() {
  try {
    const config = configService.getConfig();
    const exportData = {
      ...config,
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
    };
    
    console.log('Exported configuration:', JSON.stringify(exportData, null, 2));
    return exportData;
  } catch (error) {
    console.error('Failed to export configuration:', error.message);
    return null;
  }
}

// Export examples for use in other modules
module.exports = {
  initializeGame,
  displayCurrentSettings,
  updatePlayerLives,
  setCanvasSize,
  adjustDifficulty,
  resetGameSettings,
  safeUpdateConfig,
  getEnemySpeedForDifficulty,
  updateGameSettings,
  exportConfiguration,
};

// Uncomment to run examples
// (async () => {
//   await initializeGame();
//   await updatePlayerLives(5);
//   await adjustDifficulty('hard');
//   await displayCurrentSettings();
// })();
