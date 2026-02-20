### Prompt 3.7: Integrate Level System

```
Integrate level progression and victory conditions into game.

Requirements:
1. Update game-canvas.component.ts to:
   - Track current level number
   - Check for level completion each frame
   - Start next level when complete
   - Reset enemy grid with new level config
   - Apply difficulty modifiers to movement and shooting
   - Show level number in console (HUD later)
2. Inject LevelService
3. Handle level transition (brief pause before next wave)

TDD Approach:
- Update game-canvas.component.spec.ts:
  * Level initializes to 1
  * isLevelComplete checked each frame
  * New enemy grid spawns when level complete
  * Level number increments after completion
  * Enemy speed increases in next level
  * Enemy fire rate increases in next level
  * Level transition has brief delay
- Mock LevelService
- Implement level progression flow
- Verify multi-level gameplay

Deliverable: Working level system with progressive difficulty
```
