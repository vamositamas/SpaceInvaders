/**
 * Usage examples for FileStorageService
 * 
 * This file demonstrates how to use the FileStorageService
 * for managing JSON data storage.
 */

const FileStorageService = require('./file-storage.service');

// Create an instance of the service
const storage = new FileStorageService();

// Example 1: Write JSON data to a file
async function saveHighScore() {
  const highScoreData = {
    player: 'PlayerOne',
    score: 15000,
    level: 10,
    timestamp: new Date().toISOString(),
  };

  try {
    await storage.writeJSON('./data/highscores/score1.json', highScoreData);
    console.log('High score saved successfully!');
  } catch (error) {
    console.error('Failed to save high score:', error.message);
  }
}

// Example 2: Read JSON data from a file
async function loadHighScore() {
  try {
    const data = await storage.readJSON('./data/highscores/score1.json');
    console.log('Loaded high score:', data);
    return data;
  } catch (error) {
    console.error('Failed to load high score:', error.message);
    return null;
  }
}

// Example 3: Create a backup before modifying data
async function updateHighScoreWithBackup() {
  const filepath = './data/highscores/score1.json';

  try {
    // Create backup first
    await storage.backupFile(filepath);
    console.log('Backup created successfully!');

    // Read current data
    const data = await storage.readJSON(filepath);

    // Modify data
    data.score += 1000;
    data.timestamp = new Date().toISOString();

    // Write updated data
    await storage.writeJSON(filepath, data);
    console.log('High score updated successfully!');
  } catch (error) {
    console.error('Failed to update high score:', error.message);
  }
}

// Example 4: Ensure directory exists before operations
async function initializeGameData() {
  try {
    // Ensure all required directories exist
    await storage.ensureDirectory('./data/highscores');
    await storage.ensureDirectory('./data/settings');
    await storage.ensureDirectory('./data/config');
    console.log('All directories initialized!');
  } catch (error) {
    console.error('Failed to initialize directories:', error.message);
  }
}

// Example 5: Handle errors gracefully
async function safeReadJSON(filepath) {
  try {
    return await storage.readJSON(filepath);
  } catch (error) {
    if (error.message.includes('File not found')) {
      console.log('File does not exist, returning default data');
      return { initialized: false };
    } else if (error.message.includes('Invalid JSON')) {
      console.log('Corrupted file detected, please fix or delete');
      return null;
    } else {
      console.error('Unexpected error:', error.message);
      throw error;
    }
  }
}

// Export examples for use in other modules
module.exports = {
  saveHighScore,
  loadHighScore,
  updateHighScoreWithBackup,
  initializeGameData,
  safeReadJSON,
};

// Uncomment to run examples
// (async () => {
//   await initializeGameData();
//   await saveHighScore();
//   await loadHighScore();
//   await updateHighScoreWithBackup();
// })();
