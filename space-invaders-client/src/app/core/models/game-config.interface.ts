/**
 * Difficulty level configuration interface
 */
export interface DifficultyLevel {
  speedMultiplier: number;
  fireRateMultiplier: number;
}

/**
 * Game configuration interface
 * Matches backend schema from /src/models/schemas.js
 */
export interface GameConfig {
  canvas: {
    width: number;
    height: number;
  };
  player: {
    speed: number;
    fireRate: number;
    lives: number;
  };
  enemies: {
    rows: number;
    columns: number;
    baseSpeed: number;
    speedIncrement: number;
    fireRate: number;
  };
  difficulty: {
    easy: DifficultyLevel;
    normal: DifficultyLevel;
    hard: DifficultyLevel;
  };
}
