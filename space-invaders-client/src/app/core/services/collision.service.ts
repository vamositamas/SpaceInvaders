import { Injectable } from '@angular/core';

/**
 * Minimal axis-aligned bounding box interface used for collision checks.
 * All game entities (player, enemies, projectiles, shields) satisfy this shape.
 */
export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
  isActive: boolean;
}

/** A matched pair returned by checkProjectilesVsTargets. */
export interface CollisionPair {
  projectile: Rect;
  target: Rect;
}

/**
 * CollisionService - Axis-Aligned Bounding Box (AABB) collision detection
 *
 * All methods skip inactive entities so collision loops don't need to
 * guard against already-destroyed objects.
 */
@Injectable({
  providedIn: 'root'
})
export class CollisionService {

  /**
   * Test two rectangles for AABB overlap.
   * Returns false if either entity is inactive.
   */
  checkAABB(a: Rect, b: Rect): boolean {
    if (!a.isActive || !b.isActive) return false;
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  /**
   * Find all (projectile, target) pairs that are currently overlapping.
   * Skips inactive entities in both lists.
   */
  checkProjectilesVsTargets(projectiles: Rect[], targets: Rect[]): CollisionPair[] {
    const results: CollisionPair[] = [];
    for (const p of projectiles) {
      if (!p.isActive) continue;
      for (const t of targets) {
        if (!t.isActive) continue;
        if (this.checkAABB(p, t)) {
          results.push({ projectile: p, target: t });
        }
      }
    }
    return results;
  }

  /**
   * Returns true if any active projectile overlaps `target`.
   * Useful for checking if any enemy bullet hit the player.
   */
  checkAnyCollision(projectiles: Rect[], target: Rect): boolean {
    if (!target.isActive) return false;
    return projectiles.some(p => this.checkAABB(p, target));
  }
}
