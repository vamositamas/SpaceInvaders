### Prompt 2.10: Integrate Projectiles and Collisions

```
Integrate projectile shooting and collision detection into the game.

Requirements:
1. Update game-canvas.component.ts to:
   - Store projectiles array in component state
   - Handle spacebar/click to fire player projectiles
   - Update all projectiles each frame
   - Check for collisions each frame
   - Remove collided projectiles
   - Draw all projectiles on canvas
2. Inject ProjectileService and CollisionService
3. Add visual feedback (console.log) for collisions temporarily
4. Draw projectiles as small rectangles

TDD Approach:
- Update game-canvas.component.spec.ts with:
  * Projectiles array initializes empty
  * Spacebar press creates new projectile
  * Mouse click creates new projectile
  * Fire rate cooldown is respected
  * updateProjectiles called each frame
  * Collision detection runs each frame
  * Collided projectiles are removed
  * Projectiles render on canvas
- Mock ProjectileService and CollisionService
- Verify integration with existing player system
- Implement and make tests pass

Deliverable: Working shooting mechanism with collision detection
```
