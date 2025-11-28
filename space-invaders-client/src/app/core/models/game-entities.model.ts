/**
 * Game Entity Models
 * TypeScript interfaces and factory functions for all game entities
 */

/**
 * 2D position coordinates
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * Entity dimensions
 */
export interface Size {
  width: number;
  height: number;
}

/**
 * Base entity interface
 * All game objects extend this interface
 */
export interface Entity {
  position: Position;
  size: Size;
  isActive: boolean;
}

/**
 * Player entity
 * Represents the player's ship
 */
export interface Player extends Entity {
  lives: number;
  speed: number;
  lastFireTime: number;
}

/**
 * Projectile entity
 * Represents bullets fired by player or enemies
 */
export interface Projectile extends Entity {
  velocity: { x: number; y: number };
  ownerId: string;
}

/**
 * Enemy entity
 * Represents alien invaders
 */
export interface Enemy extends Entity {
  type: string;
  pointValue: number;
  row: number;
  col: number;
}

/**
 * Shield entity
 * Represents defensive barriers
 */
export interface Shield extends Entity {
  health: number;
  maxHealth: number;
}

/**
 * Enemy type definitions
 */
export type EnemyType = 'squid' | 'crab' | 'octopus';

/**
 * Point values for enemy types
 */
const ENEMY_POINTS: Record<EnemyType, number> = {
  squid: 30,
  crab: 20,
  octopus: 10
};

/**
 * Create a new Player entity
 * @param x X position
 * @param y Y position
 * @param speed Player movement speed (default: 5)
 * @param lives Number of lives (default: 3)
 * @returns Player entity
 */
export function createPlayer(
  x: number,
  y: number,
  speed: number = 5,
  lives: number = 3
): Player {
  return {
    position: { x, y },
    size: { width: 40, height: 20 },
    isActive: true,
    lives,
    speed,
    lastFireTime: 0
  };
}

/**
 * Create a new Enemy entity
 * @param x X position
 * @param y Y position
 * @param type Enemy type (squid, crab, octopus)
 * @param row Row position in enemy grid
 * @param col Column position in enemy grid
 * @returns Enemy entity
 */
export function createEnemy(
  x: number,
  y: number,
  type: string,
  row: number,
  col: number
): Enemy {
  const pointValue = ENEMY_POINTS[type as EnemyType] || 10;
  
  return {
    position: { x, y },
    size: { width: 30, height: 20 },
    isActive: true,
    type,
    pointValue,
    row,
    col
  };
}

/**
 * Create a new Projectile entity
 * @param x X position
 * @param y Y position
 * @param velocityY Vertical velocity (negative for upward, positive for downward)
 * @param ownerId ID of the entity that fired this projectile
 * @returns Projectile entity
 */
export function createProjectile(
  x: number,
  y: number,
  velocityY: number,
  ownerId: string
): Projectile {
  return {
    position: { x, y },
    size: { width: 4, height: 10 },
    isActive: true,
    velocity: { x: 0, y: velocityY },
    ownerId
  };
}

/**
 * Create a new Shield entity
 * @param x X position
 * @param y Y position
 * @param health Shield health (default: 100)
 * @returns Shield entity
 */
export function createShield(
  x: number,
  y: number,
  health: number = 100
): Shield {
  return {
    position: { x, y },
    size: { width: 60, height: 40 },
    isActive: true,
    health,
    maxHealth: health
  };
}
