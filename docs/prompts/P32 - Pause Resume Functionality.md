### Prompt 4.6: Pause/Resume Functionality

```
Create pause and resume system for game.

Requirements:
1. Update input-handler.service.ts to:
   - Add isPausePressed(): boolean method for P key
   - Add isEscapePressed(): boolean method for Escape key
2. Update game-canvas.component.ts to:
   - Check for pause input each frame
   - Toggle pause state on P key or right-click
   - Stop updating game entities when paused
   - Continue rendering when paused (with overlay indicator)
   - Resume with P key or right-click again
3. Inject GameStateService for pause state management

TDD Approach:
- Update input-handler.service.spec.ts:
  * isPausePressed returns true when P key down
  * isEscapePressed returns true when Escape down
- Update game-canvas.component.spec.ts:
  * P key press toggles pause state
  * Right-click toggles pause state
  * Game updates stop when paused
  * Game updates resume when unpaused
  * Pause state reflected in GameStateService
- Implement pause logic
- Add visual pause indicator (console.log for now)

Deliverable: Working pause/resume game functionality
```
