/**
 * Configuration validation schemas
 */

/**
 * Validates canvas configuration
 * @param {object} canvas - Canvas configuration
 * @returns {boolean} True if valid
 * @throws {Error} If validation fails
 */
function validateCanvas(canvas) {
  if (!canvas || typeof canvas !== 'object') {
    throw new Error('Canvas configuration must be an object');
  }
  
  if (typeof canvas.width !== 'number' || canvas.width <= 0) {
    throw new Error('Canvas width must be a positive number');
  }
  
  if (typeof canvas.height !== 'number' || canvas.height <= 0) {
    throw new Error('Canvas height must be a positive number');
  }
  
  return true;
}

/**
 * Validates player configuration
 * @param {object} player - Player configuration
 * @returns {boolean} True if valid
 * @throws {Error} If validation fails
 */
function validatePlayer(player) {
  if (!player || typeof player !== 'object') {
    throw new Error('Player configuration must be an object');
  }
  
  if (typeof player.speed !== 'number' || player.speed <= 0) {
    throw new Error('Player speed must be a positive number');
  }
  
  if (typeof player.fireRate !== 'number' || player.fireRate <= 0) {
    throw new Error('Player fireRate must be a positive number');
  }
  
  if (typeof player.lives !== 'number' || player.lives <= 0 || !Number.isInteger(player.lives)) {
    throw new Error('Player lives must be a positive integer');
  }
  
  return true;
}

/**
 * Validates enemies configuration
 * @param {object} enemies - Enemies configuration
 * @returns {boolean} True if valid
 * @throws {Error} If validation fails
 */
function validateEnemies(enemies) {
  if (!enemies || typeof enemies !== 'object') {
    throw new Error('Enemies configuration must be an object');
  }
  
  if (typeof enemies.rows !== 'number' || enemies.rows <= 0 || !Number.isInteger(enemies.rows)) {
    throw new Error('Enemies rows must be a positive integer');
  }
  
  if (typeof enemies.columns !== 'number' || enemies.columns <= 0 || !Number.isInteger(enemies.columns)) {
    throw new Error('Enemies columns must be a positive integer');
  }
  
  if (typeof enemies.baseSpeed !== 'number' || enemies.baseSpeed <= 0) {
    throw new Error('Enemies baseSpeed must be a positive number');
  }
  
  if (typeof enemies.speedIncrement !== 'number' || enemies.speedIncrement < 0) {
    throw new Error('Enemies speedIncrement must be a non-negative number');
  }
  
  if (typeof enemies.fireRate !== 'number' || enemies.fireRate <= 0) {
    throw new Error('Enemies fireRate must be a positive number');
  }
  
  return true;
}

/**
 * Validates difficulty level configuration
 * @param {object} difficultyLevel - Difficulty level configuration
 * @param {string} levelName - Name of the difficulty level
 * @returns {boolean} True if valid
 * @throws {Error} If validation fails
 */
function validateDifficultyLevel(difficultyLevel, levelName) {
  if (!difficultyLevel || typeof difficultyLevel !== 'object') {
    throw new Error(`Difficulty level '${levelName}' must be an object`);
  }
  
  if (typeof difficultyLevel.speedMultiplier !== 'number' || difficultyLevel.speedMultiplier <= 0) {
    throw new Error(`Difficulty level '${levelName}' speedMultiplier must be a positive number`);
  }
  
  if (typeof difficultyLevel.fireRateMultiplier !== 'number' || difficultyLevel.fireRateMultiplier <= 0) {
    throw new Error(`Difficulty level '${levelName}' fireRateMultiplier must be a positive number`);
  }
  
  return true;
}

/**
 * Validates difficulty configuration
 * @param {object} difficulty - Difficulty configuration
 * @returns {boolean} True if valid
 * @throws {Error} If validation fails
 */
function validateDifficulty(difficulty) {
  if (!difficulty || typeof difficulty !== 'object') {
    throw new Error('Difficulty configuration must be an object');
  }
  
  const requiredLevels = ['easy', 'normal', 'hard'];
  for (const level of requiredLevels) {
    if (!difficulty[level]) {
      throw new Error(`Difficulty level '${level}' is required`);
    }
    validateDifficultyLevel(difficulty[level], level);
  }
  
  return true;
}

/**
 * Validates high score data
 * @param {object} scoreData - High score data to validate
 * @returns {boolean} True if valid
 * @throws {Error} If validation fails
 */
function validateHighScore(scoreData) {
  if (!scoreData || typeof scoreData !== 'object') {
    throw new Error('High score data must be an object');
  }

  // Validate playerName
  if (typeof scoreData.playerName !== 'string' || scoreData.playerName.length < 1 || scoreData.playerName.length > 20) {
    throw new Error('Player name must be between 1 and 20 characters');
  }

  // Validate score
  if (typeof scoreData.score !== 'number' || scoreData.score < 0) {
    throw new Error('Score must be a non-negative number');
  }

  // Validate level
  if (typeof scoreData.level !== 'number' || scoreData.level < 1 || !Number.isInteger(scoreData.level)) {
    throw new Error('Level must be an integer >= 1');
  }

  // Validate date if present
  if (scoreData.date) {
    const date = new Date(scoreData.date);
    if (isNaN(date.getTime())) {
      throw new Error('Date must be a valid date string');
    }
  }

  // Validate duration if present
  if (scoreData.duration !== undefined) {
    if (typeof scoreData.duration !== 'number' || scoreData.duration < 0) {
      throw new Error('Duration must be a non-negative number');
    }
  }

  return true;
}

/**
 * Validates complete configuration object
 * @param {object} config - Configuration object to validate
 * @param {boolean} requireComplete - Whether to require all sections (default: true)
 * @returns {boolean} True if valid
 * @throws {Error} If validation fails
 */
function validateConfig(config, requireComplete = true) {
  if (!config || typeof config !== 'object') {
    throw new Error('Configuration must be an object');
  }
  
  // If requireComplete, ensure all sections are present
  if (requireComplete) {
    const requiredSections = ['canvas', 'player', 'enemies', 'difficulty'];
    for (const section of requiredSections) {
      if (!config[section]) {
        throw new Error(`Configuration section '${section}' is required`);
      }
    }
  }
  
  // Validate each section if present
  if (config.canvas) {
    validateCanvas(config.canvas);
  }
  
  if (config.player) {
    validatePlayer(config.player);
  }
  
  if (config.enemies) {
    validateEnemies(config.enemies);
  }
  
  if (config.difficulty) {
    validateDifficulty(config.difficulty);
  }
  
  return true;
}

module.exports = {
  validateCanvas,
  validatePlayer,
  validateEnemies,
  validateDifficulty,
  validateDifficultyLevel,
  validateConfig,
  validateHighScore,
};
