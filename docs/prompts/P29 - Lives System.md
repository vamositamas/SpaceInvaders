### Prompt 4.3: Lives System

```
Create player lives system with hit detection and game over.

Requirements:
1. Create /src/app/core/services/lives.service.ts with:
   - initLives(maxLives): number - starts with 3 lives
   - loseLife(currentLives): number - decrements lives
   - hasLivesRemaining(lives): boolean - checks if lives > 0
   - isGameOver(lives): boolean - checks if lives = 0
2. Update game-canvas.component.ts to:
   - Track player lives
   - Check enemy projectile hits on player
   - Reduce life when player hit
   - Brief invincibility after being hit (2 seconds)
   - Trigger game over when lives = 0

TDD Approach:
- Create lives.service.spec.ts:
  * initLives returns maxLives value
  * loseLife decrements lives by 1
  * loseLife doesn't go below 0
  * hasLivesRemaining returns true when lives > 0
  * hasLivesRemaining returns false when lives = 0
  * isGameOver returns true when lives = 0
- Update game-canvas.component.spec.ts:
  * Lives initialize to 3
  * Player hit reduces lives by 1
  * Player invincible for 2 seconds after hit
  * Multiple hits during invincibility don't reduce lives
  * Game over triggered at 0 lives
- Implement lives system with invincibility frames

Deliverable: Lives system with player hit detection
```
