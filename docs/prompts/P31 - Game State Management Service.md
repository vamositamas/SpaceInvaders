### Prompt 4.5: Game State Management Service

```
Create centralized game state management service.

Requirements:
1. Create /src/app/core/services/game-state.service.ts with:
   - BehaviorSubjects for: score$, lives$, level$, isPaused$, gameOver$
   - updateScore(points): void - updates score observable
   - updateLives(lives): void - updates lives observable
   - updateLevel(level): void - updates level observable
   - pauseGame(): void - sets pause state
   - resumeGame(): void - clears pause state
   - resetGame(): void - resets all state to initial values
   - endGame(): void - sets game over state
2. Use RxJS BehaviorSubjects for reactive state
3. Components subscribe to observables for state updates

TDD Approach:
- Create game-state.service.spec.ts:
  * Observables emit initial values
  * updateScore emits new score value
  * updateLives emits new lives value
  * updateLevel emits new level value
  * pauseGame sets isPaused$ to true
  * resumeGame sets isPaused$ to false
  * endGame sets gameOver$ to true
  * resetGame resets all values to defaults
  * Multiple subscriptions receive updates
- Use TestScheduler for observable testing
- Implement reactive state management

Deliverable: Centralized state management with RxJS
```
