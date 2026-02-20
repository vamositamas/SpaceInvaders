import { Injectable } from '@angular/core';
import { GameConfig } from '../models';

/**
 * LevelService - Tracks current level and derives difficulty-scaled configs
 */
@Injectable({
  providedIn: 'root'
})
export class LevelService {
  private currentLevel = 1;

  getCurrentLevel(): number {
    return this.currentLevel;
  }

  nextLevel(): void {
    this.currentLevel++;
  }

  reset(): void {
    this.currentLevel = 1;
  }

  /**
   * Return a copy of `baseConfig` with enemy speed and fire-rate scaled
   * for the given level number.
   * - Speed: ×1.1 per level above 1, capped at 10× base
   * - Fire rate: ×0.95 per level above 1, floored at 500 ms
   */
  getLevelConfig(level: number, baseConfig: GameConfig): GameConfig {
    const levelsAbove1 = level - 1;
    const speedMult = Math.min(Math.pow(1.1, levelsAbove1), 10);
    const fireRateMult = Math.pow(0.95, levelsAbove1);

    return {
      ...baseConfig,
      enemies: {
        ...baseConfig.enemies,
        baseSpeed: baseConfig.enemies.baseSpeed * speedMult,
        fireRate: Math.max(500, baseConfig.enemies.fireRate * fireRateMult)
      }
    };
  }
}
