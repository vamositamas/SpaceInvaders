/**
 * ValidationService — anti-cheat validation for high score submissions.
 *
 * Score bounds are based on the Space Invaders game config:
 *   - 55 enemies per wave × max 30 pts × 2× combo = 3,300
 *   - Mystery ship up to 300 pts × 2× = 600
 *   - Generous cap: MAX_SCORE_PER_LEVEL = 5,000
 *
 * Duration bounds use the minimum time to kill 55 enemies at 500 ms fire
 * rate (27.5 s). A generous floor of 15 s per level is used to avoid false
 * positives.
 */

const MAX_SCORE_PER_LEVEL = 5000;
const MIN_SECONDS_PER_LEVEL = 15;
const ALLOWED_NAME_CHARS = /[^a-zA-Z0-9 _-]/g;
const MAX_NAME_LENGTH = 20;

/**
 * Returns true if the score is plausible for the level reached.
 * @param {number} score
 * @param {number} level
 * @returns {boolean}
 */
function checkScoreRealistic(score, level) {
  if (typeof score !== 'number' || typeof level !== 'number') return false;
  return score <= level * MAX_SCORE_PER_LEVEL;
}

/**
 * Returns true if the total game duration is long enough for the level.
 * @param {number} duration  Total seconds elapsed in the game session
 * @param {number} level     Level reached
 * @returns {boolean}
 */
function checkDurationRealistic(duration, level) {
  if (typeof duration !== 'number' || typeof level !== 'number') return false;
  return duration >= level * MIN_SECONDS_PER_LEVEL;
}

/**
 * Strips characters that could be used for XSS or SQL injection, removes
 * leading/trailing whitespace, and truncates to the maximum name length.
 * @param {string} name
 * @returns {string}
 */
function sanitizePlayerName(name) {
  if (typeof name !== 'string') return '';
  return name.replace(ALLOWED_NAME_CHARS, '').trim().slice(0, MAX_NAME_LENGTH);
}

/**
 * Validates that a high score submission is not suspicious.
 * @param {number} score
 * @param {number} level
 * @param {number|null|undefined} duration
 * @throws {Error} if the score or duration fails anti-cheat checks
 * @returns {true}
 */
function validateHighScore(score, level, duration) {
  if (!checkScoreRealistic(score, level)) {
    throw new Error(
      `Score is not realistic for level ${level} (max: ${level * MAX_SCORE_PER_LEVEL})`
    );
  }

  if (duration !== undefined && duration !== null) {
    if (!checkDurationRealistic(duration, level)) {
      throw new Error(`Game duration is too short for level ${level}`);
    }
  }

  return true;
}

module.exports = {
  checkScoreRealistic,
  checkDurationRealistic,
  sanitizePlayerName,
  validateHighScore,
};
