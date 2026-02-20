### Prompt 3.4: Integrate Enemy System into Game

```
Integrate enemy grid, movement, and shooting into the game canvas.

Requirements:
1. Update game-canvas.component.ts to:
   - Create enemy grid on game start
   - Store enemies array and movementState
   - Update enemy positions each frame
   - Handle edge collision and descent
   - Trigger enemy shooting at intervals
   - Check projectile-enemy collisions
   - Remove destroyed enemies
   - Draw enemies on canvas (different colors per type)
2. Inject EnemyService, EnemyMovementService, EnemyShooting Service
3. Add score tracking when enemies destroyed
4. Draw enemies as rectangles with type-specific colors

TDD Approach:
- Update game-canvas.component.spec.ts:
  * Enemies array initializes with 55 enemies
  * Enemy positions update each frame
  * Edge collision triggers descent
  * Direction reverses after descent
  * Enemies fire projectiles at intervals
  * Projectile hits remove enemies
  * Score increases by enemy point value
  * Destroyed enemies don't render
  * All enemy types render with correct colors
- Mock all enemy services
- Implement integration
- Verify tests pass

Deliverable: Fully functional enemy system integrated into gameplay
```
