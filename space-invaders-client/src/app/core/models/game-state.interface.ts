/**
 * Game state interface
 * Represents the current state of the game
 * 
 * @deprecated Use GameState from game-state.model.ts instead
 * This file is kept for backward compatibility only
 */
export interface LegacyGameState {
  score: number;
  lives: number;
  level: number;
  isPaused: boolean;
  isGameOver: boolean;
  isPlaying: boolean;
}
