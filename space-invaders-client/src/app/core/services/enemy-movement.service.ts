import { Injectable } from '@angular/core';
import { EnemyEntity } from './enemy.service';

const DESCENT_STEP = 20;           // pixels dropped each direction reversal
const BASE_SPEED_PX_PER_SEC = 60;  // base speed (matches config baseSpeed=1 × 60)
const SPEED_INCREMENT = 6;         // extra px/s per destroyed enemy per column

/**
 * EnemyMovementService - Moves the enemy formation as a group
 *
 * Classic Space Invaders rules:
 * - All enemies move together horizontally.
 * - When the group hits a canvas edge they descend one step and reverse.
 * - Speed scales up as enemies are destroyed.
 */
@Injectable({
  providedIn: 'root'
})
export class EnemyMovementService {
  private direction: 1 | -1 = 1;  // 1 = right, -1 = left

  /**
   * Advance the enemy formation by `deltaTime` milliseconds.
   * @param deltaTime    Time since last frame (ms)
   * @param enemies      All enemy entities (active and inactive)
   * @param canvasWidth  Canvas width for edge detection
   * @param totalEnemies Original total enemy count (for speed scaling)
   */
  update(
    deltaTime: number,
    enemies: EnemyEntity[],
    canvasWidth: number,
    totalEnemies: number
  ): void {
    const active = enemies.filter(e => e.isActive);
    if (active.length === 0) return;

    const speed = this.computeSpeed(active.length, totalEnemies);
    const move = speed * (deltaTime / 1000) * this.direction;

    // Tentatively move all enemies
    for (const e of active) {
      e.x += move;
    }

    // Check edge collision after movement
    const minX = Math.min(...active.map(e => e.x));
    const maxX = Math.max(...active.map(e => e.x + e.width));

    if (maxX >= canvasWidth || minX <= 0) {
      // Reverse direction and descend
      this.direction = this.direction === 1 ? -1 : 1;
      for (const e of active) {
        e.y += DESCENT_STEP;
        // Nudge back inside canvas to avoid sticky edge
        if (maxX >= canvasWidth) e.x -= (maxX - canvasWidth);
        if (minX <= 0) e.x -= minX;
      }
    }
  }

  /**
   * Calculate current speed based on remaining enemy count.
   * Fewer enemies → faster movement.
   */
  computeSpeed(activeCount: number, totalCount: number): number {
    const destroyed = totalCount - activeCount;
    return BASE_SPEED_PX_PER_SEC + destroyed * SPEED_INCREMENT;
  }

  /** Reset direction to rightward (call on new game / new level). */
  reset(): void {
    this.direction = 1;
  }
}
