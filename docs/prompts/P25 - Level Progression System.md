### Prompt 3.6: Level Progression System

```
Create level progression with increasing difficulty and wave management.

Requirements:
1. Create /src/app/core/services/level.service.ts with:
   - initLevel(levelNumber): LevelConfig - returns config for level
   - calculateEnemySpeed(baseSpeed, level): number - increases speed per level
   - calculateFireRate(baseRate, level): number - decreases fire cooldown
   - isLevelComplete(enemies[]): boolean - checks if all enemies destroyed
   - startNextLevel(currentLevel): number - increments level
2. Difficulty scaling: speed increases 10% per level, fire rate decreases 5%
3. Level complete when all enemies destroyed
4. New wave spawns with increased difficulty

TDD Approach:
- Create level.service.spec.ts
- Write tests for:
  * initLevel returns config for level 1
  * calculateEnemySpeed returns baseSpeed * 1.1 for level 2
  * calculateEnemySpeed scales correctly for higher levels
  * calculateFireRate reduces cooldown per level
  * isLevelComplete returns true when no active enemies
  * isLevelComplete returns false when enemies remain
  * startNextLevel increments level counter
- Implement level.service.ts
- Cap maximum difficulty at reasonable level

Deliverable: Level progression with difficulty scaling
```
