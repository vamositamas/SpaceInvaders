### Prompt 5.7: Pause Overlay Component

```
Create pause overlay that displays when game is paused.

Requirements:
1. Create pause-overlay.component.ts in /src/app/features/game/components with:
   - Translucent overlay covering game canvas
   - "PAUSED" text centered
   - Instructions to press P or right-click to resume
   - Resume button
   - Main Menu button
   - Subscribe to GameStateService.isPaused$
2. Component only visible when game paused
3. Semi-transparent background to show game state underneath

TDD Approach:
- Create pause-overlay.component.spec.ts:
  * Component hidden when not paused
  * Component visible when paused
  * "PAUSED" text displayed
  * Resume instructions shown
  * Resume button calls resumeGame()
  * Main Menu button navigates to menu
  * Overlay subscribes to pause state
  * Component unsubscribes on destroy
- Mock GameStateService
- Implement overlay with conditional rendering
- Verify visibility toggling

Deliverable: Pause overlay with resume functionality
```
