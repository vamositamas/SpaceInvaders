### Prompt 4.2: Shield Collision and Damage

```
Integrate shield collisions with projectiles.

Requirements:
1. Update collision.service.ts to add:
   - checkProjectileShieldCollisions(projectiles[], shields[]): CollisionPair[]
2. Update game-canvas.component.ts to:
   - Create shields on game start
   - Check projectile-shield collisions each frame
   - Apply damage to shields when hit
   - Remove colliding projectiles
   - Remove destroyed shields
   - Draw shields with health-based opacity
3. Both player and enemy projectiles damage shields

TDD Approach:
- Update collision.service.spec.ts:
  * checkProjectileShieldCollisions finds projectile-shield pairs
  * Collisions detected for both player and enemy projectiles
  * Inactive shields ignored in collision checks
- Update game-canvas.component.spec.ts:
  * Shields array initializes with 4 shields
  * Projectile collision with shield reduces shield health
  * Colliding projectile removed from game
  * Shield removed when health reaches 0
  * Shield opacity reflects remaining health
- Implement collision handling
- Visual feedback for shield damage

Deliverable: Shields that degrade when hit by projectiles
```
