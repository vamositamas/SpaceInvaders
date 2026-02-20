import { Injectable } from '@angular/core';

/**
 * A single projectile in the game world.
 */
export interface Projectile {
  x: number;
  y: number;
  width: number;
  height: number;
  vy: number;       // vertical velocity in pixels per second (negative = up)
  isActive: boolean;
}

/**
 * ProjectileService - Creates, moves, and culls projectiles
 *
 * Separate pools are maintained for player and enemy projectiles so
 * collision checks only need to test the relevant set.
 */
@Injectable({
  providedIn: 'root'
})
export class ProjectileService {
  static readonly PROJECTILE_WIDTH = 4;
  static readonly PROJECTILE_HEIGHT = 15;
  static readonly PLAYER_PROJECTILE_SPEED = 500;  // px/s upward
  static readonly ENEMY_PROJECTILE_SPEED = 250;   // px/s downward

  private playerProjectiles: Projectile[] = [];
  private enemyProjectiles: Projectile[] = [];

  /** Fire a new player projectile originating at (x, y). */
  addPlayerProjectile(x: number, y: number): void {
    this.playerProjectiles.push({
      x,
      y,
      width: ProjectileService.PROJECTILE_WIDTH,
      height: ProjectileService.PROJECTILE_HEIGHT,
      vy: -ProjectileService.PLAYER_PROJECTILE_SPEED,
      isActive: true
    });
  }

  /** Fire a new enemy projectile originating at (x, y). */
  addEnemyProjectile(x: number, y: number): void {
    this.enemyProjectiles.push({
      x,
      y,
      width: ProjectileService.PROJECTILE_WIDTH,
      height: ProjectileService.PROJECTILE_HEIGHT,
      vy: ProjectileService.ENEMY_PROJECTILE_SPEED,
      isActive: true
    });
  }

  /**
   * Advance all projectiles by `deltaTime` milliseconds and cull those
   * that have left the visible canvas area.
   * @param deltaTime    Time since last frame in milliseconds
   * @param canvasHeight Canvas height used to detect off-screen projectiles
   */
  update(deltaTime: number, canvasHeight: number): void {
    const dt = deltaTime / 1000;

    for (const p of this.playerProjectiles) {
      if (!p.isActive) continue;
      p.y += p.vy * dt;
      if (p.y + p.height < 0) p.isActive = false;
    }

    for (const p of this.enemyProjectiles) {
      if (!p.isActive) continue;
      p.y += p.vy * dt;
      if (p.y > canvasHeight) p.isActive = false;
    }

    // Prune inactive entries to avoid unbounded growth
    this.playerProjectiles = this.playerProjectiles.filter(p => p.isActive);
    this.enemyProjectiles = this.enemyProjectiles.filter(p => p.isActive);
  }

  /** Mark a projectile as inactive (used by collision detection). */
  deactivate(projectile: Projectile): void {
    projectile.isActive = false;
  }

  /** Remove all projectiles (call on game reset or level start). */
  clear(): void {
    this.playerProjectiles = [];
    this.enemyProjectiles = [];
  }

  // ─── Accessors ───────────────────────────────────────────────────────────

  getPlayerProjectiles(): Projectile[] {
    return this.playerProjectiles;
  }

  getEnemyProjectiles(): Projectile[] {
    return this.enemyProjectiles;
  }

  getActivePlayerProjectiles(): Projectile[] {
    return this.playerProjectiles.filter(p => p.isActive);
  }

  getActiveEnemyProjectiles(): Projectile[] {
    return this.enemyProjectiles.filter(p => p.isActive);
  }
}
