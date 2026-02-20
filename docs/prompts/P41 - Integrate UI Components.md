### Prompt 5.8: Integrate UI Components

```
Wire all UI components together in the game layout.

Requirements:
1. Update game.component.ts to:
   - Include game-canvas, game-hud, and pause-overlay as child components
   - Layout HUD above canvas
   - Position pause overlay over canvas
   - Handle routing from menu to game
2. Update app-routing.module.ts with:
   - Route '' → MainMenuComponent
   - Route 'game' → GameComponent
   - Route 'high-scores' → HighScoresComponent
3. Update app.component template to include router-outlet
4. Apply global Material theme styles

TDD Approach:
- Update game.component.spec.ts:
  * All child components render correctly
  * HUD positioned above canvas
  * Pause overlay z-index higher than canvas
  * Components communicate via services
- Create routing.spec.ts:
  * Default route loads main menu
  * /game route loads game component
  * /high-scores route loads high scores
  * Navigation between routes works
- Implement layout and routing
- Verify integration

Deliverable: Fully integrated UI with navigation
```
