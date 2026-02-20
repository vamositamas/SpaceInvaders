### Prompt 2.7: Game Canvas Component

```
Create an Angular component to render the game canvas and integrate services.

Requirements:
1. Create game-canvas.component.ts in /src/app/features/game/components with:
   - @ViewChild for canvas element
   - Inject: CanvasService, GameLoopService, InputHandlerService, PlayerService
   - ngOnInit: initialize canvas and start game loop
   - ngOnDestroy: cleanup listeners and stop loop
   - update(deltaTime): void - main update method called each frame
   - render(): void - draws all entities
2. Template: <canvas #gameCanvas width="800" height="600"></canvas>
3. Initialize player on component load
4. Draw player as a rectangle on canvas
5. Update player position each frame based on input

TDD Approach:
- Create game-canvas.component.spec.ts
- Write tests for:
  * Component creates successfully
  * Canvas initializes on ngOnInit
  * Game loop starts on ngOnInit
  * Input handlers are enabled
  * Player is created and positioned correctly
  * Update method is called by game loop
  * Render draws player on canvas
  * Cleanup happens on ngOnDestroy
- Mock all injected services
- Use ComponentFixture for testing
- Implement component to integrate all services

Deliverable: Working canvas component with player rendering
```
