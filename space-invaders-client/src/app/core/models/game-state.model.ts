/**
 * Game State Model
 * Defines the overall game state and status
 */

import { Player, Enemy, Projectile, Shield } from './game-entities.model';
import { createPlayer } from './game-entities.model';

/**
 * Game status enumeration
 */
export enum GameStatus {
  READY = 'READY',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  GAME_OVER = 'GAME_OVER',
  LEVEL_COMPLETE = 'LEVEL_COMPLETE'
}

/**
 * Overall game state
 * Contains all game entities and state properties
 */
export interface GameState {
  score: number;
  level: number;
  lives: number;
  status: GameStatus;
  isPaused: boolean;
  player: Player;
  enemies: Enemy[];
  projectiles: Projectile[];
  shields: Shield[];
}

/**
 * Create initial game state
 * @returns GameState with default values
 */
export function createInitialGameState(): GameState {
  return {
    score: 0,
    level: 1,
    lives: 3,
    status: GameStatus.READY,
    isPaused: false,
    player: createPlayer(400, 550),
    enemies: [],
    projectiles: [],
    shields: []
  };
}
