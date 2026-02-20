import { Injectable } from '@angular/core';
import { GameConfig } from '../models';

/** Enemy types used by Space Invaders. */
export type EnemyType = 'squid' | 'crab' | 'octopus';

/** A single enemy entity in the game world. */
export interface EnemyEntity {
  x: number;
  y: number;
  width: number;
  height: number;
  isActive: boolean;
  type: EnemyType;
  pointValue: number;
  row: number;
  col: number;
}

const ENEMY_WIDTH = 30;
const ENEMY_HEIGHT = 20;
const H_SPACING = 50;   // horizontal centre-to-centre spacing
const V_SPACING = 35;   // vertical centre-to-centre spacing
const GRID_TOP_Y = 60;  // y position of the first row

const POINT_VALUES: Record<EnemyType, number> = {
  squid: 30,
  crab: 20,
  octopus: 10
};

function rowToType(row: number): EnemyType {
  if (row === 0) return 'squid';
  if (row <= 2) return 'crab';
  return 'octopus';
}

/**
 * EnemyService - Manages the enemy grid state
 *
 * Responsible for creating the grid and exposing query helpers.
 * Movement and shooting are delegated to their own services.
 */
@Injectable({
  providedIn: 'root'
})
export class EnemyService {
  private enemies: EnemyEntity[] = [];

  /**
   * Initialise a fresh enemy grid centred on `canvasWidth`.
   * @param config       Active game configuration (rows / columns)
   * @param canvasWidth  Canvas pixel width used for horizontal centering
   */
  initGrid(config: GameConfig, canvasWidth: number): void {
    const { rows, columns } = config.enemies;
    const gridWidth = columns * H_SPACING - (H_SPACING - ENEMY_WIDTH);
    const startX = Math.floor((canvasWidth - gridWidth) / 2);

    this.enemies = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        const type = rowToType(row);
        this.enemies.push({
          x: startX + col * H_SPACING,
          y: GRID_TOP_Y + row * V_SPACING,
          width: ENEMY_WIDTH,
          height: ENEMY_HEIGHT,
          isActive: true,
          type,
          pointValue: POINT_VALUES[type],
          row,
          col
        });
      }
    }
  }

  /** All enemies (active and inactive). */
  getAllEnemies(): EnemyEntity[] {
    return this.enemies;
  }

  /** Currently living enemies. */
  getActiveEnemies(): EnemyEntity[] {
    return this.enemies.filter(e => e.isActive);
  }

  /** True when every enemy has been destroyed. */
  areAllDestroyed(): boolean {
    return this.enemies.every(e => !e.isActive);
  }

  /**
   * Returns the lowest (highest y) active enemy in each column.
   * Used by the shooting service to pick valid shooters.
   */
  getBottomEnemiesPerColumn(): EnemyEntity[] {
    const byColumn = new Map<number, EnemyEntity>();
    for (const e of this.getActiveEnemies()) {
      const current = byColumn.get(e.col);
      if (!current || e.row > current.row) {
        byColumn.set(e.col, e);
      }
    }
    return Array.from(byColumn.values());
  }
}
