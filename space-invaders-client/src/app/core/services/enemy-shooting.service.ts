import { Injectable } from '@angular/core';
import { EnemyEntity } from './enemy.service';

/**
 * EnemyShootingService - Randomly selects a shooter from the bottom row
 *
 * Only the lowest-alive enemy in each column is eligible to fire.
 * The caller is responsible for providing those candidates (via
 * EnemyService.getBottomEnemiesPerColumn).
 */
@Injectable({
  providedIn: 'root'
})
export class EnemyShootingService {
  private accumulatedTime = 0;

  /**
   * Accumulate delta time and fire one projectile when the cooldown expires.
   *
   * @param deltaTime          Time since last frame (ms)
   * @param bottomRowEnemies   Eligible shooters (one per column)
   * @param addEnemyProjectile Callback to spawn a projectile at (x, y)
   * @param currentTime        Absolute time (ms) — unused but kept for API symmetry
   * @param fireRateMs         How often enemies fire (ms between shots)
   */
  update(
    deltaTime: number,
    bottomRowEnemies: EnemyEntity[],
    addEnemyProjectile: (x: number, y: number) => void,
    currentTime: number,
    fireRateMs: number
  ): void {
    if (bottomRowEnemies.length === 0) return;

    this.accumulatedTime += deltaTime;

    if (this.accumulatedTime >= fireRateMs) {
      this.accumulatedTime = 0;
      const shooter = bottomRowEnemies[Math.floor(Math.random() * bottomRowEnemies.length)];
      const x = shooter.x + shooter.width / 2 - 2;
      const y = shooter.y + shooter.height;
      addEnemyProjectile(x, y);
    }
  }

  /** Reset accumulated time (call at new game / new level start). */
  reset(): void {
    this.accumulatedTime = 0;
  }
}
