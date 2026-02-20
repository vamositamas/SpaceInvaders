### Prompt 5.1: Game HUD Component

```
Create heads-up display for score, lives, and level information.

Requirements:
1. Create game-hud.component.ts in /src/app/features/game/components with:
   - Display current score (top-left)
   - Display high score (top-center)
   - Display remaining lives (top-right with icons)
   - Display current level (top-right)
   - Subscribe to GameStateService observables
2. Template uses Angular Material typography and icons
3. Style HUD to overlay canvas without interfering with gameplay
4. Use mat-icon for life indicators

TDD Approach:
- Create game-hud.component.spec.ts:
  * Component displays score from GameStateService
  * Score updates reactively when state changes
  * Lives displayed as number and icons
  * Level number displays correctly
  * High score displays correctly
  * Component unsubscribes on destroy
- Mock GameStateService with test observables
- Implement component with subscriptions
- Test reactive updates

Deliverable: Functional HUD displaying game stats
```
