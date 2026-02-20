### Prompt 4.7: Enemy-Player Collision (Game Over Condition)

```
Add game over condition when enemies reach player level.

Requirements:
1. Update collision.service.ts to add:
   - checkEnemyPlayerCollision(enemies[], player): boolean
   - checkEnemyReachedBottom(enemies[], bottomThreshold): boolean
2. Update game-canvas.component.ts to:
   - Check if any enemy collides with player
   - Check if any enemy reaches bottom threshold (player Y level)
   - Trigger immediate game over if either condition met
   - Show game over message (console.log for now)

TDD Approach:
- Update collision.service.spec.ts:
  * checkEnemyPlayerCollision detects enemy touching player
  * checkEnemyReachedBottom returns true if enemy Y >= threshold
  * Returns false when enemies above threshold
- Update game-canvas.component.spec.ts:
  * Game over triggered on enemy-player collision
  * Game over triggered when enemy reaches bottom
  * Game updates stop on game over
  * Game over state updates in GameStateService
- Implement collision checks
- Trigger game over flow

Deliverable: Game over conditions for enemy invasion
```
