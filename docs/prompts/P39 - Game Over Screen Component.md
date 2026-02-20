### Prompt 5.6: Game Over Screen Component

```
Create game over screen with score display and high score entry.

Requirements:
1. Create game-over.component.ts in /src/app/features/game-over with:
   - Display final score and level reached
   - Show "New High Score!" message if applicable
   - Input field for player name (if high score)
   - Submit button to save high score
   - Play Again button (restarts game)
   - Main Menu button (returns to menu)
   - Subscribe to GameStateService for game over state
2. Use Angular Material form components
3. Validate player name (1-20 characters)

TDD Approach:
- Create game-over.component.spec.ts:
  * Component displays final score
  * Component displays level reached
  * High score message shown if score qualifies
  * Name input appears for high scores
  * Name validation works (length, characters)
  * Submit button saves score to backend
  * Play Again resets game and navigates to game
  * Main Menu navigates to menu
  * Component appears on game over state
- Mock HttpClient for API submission
- Mock Router for navigation
- Implement component with forms

Deliverable: Game over screen with high score submission
```
