### Prompt 2.4: Game Loop Service

```
Create a game loop service that runs at 60 FPS using requestAnimationFrame.

Requirements:
1. Create /src/app/core/services/game-loop.service.ts with:
   - start(updateCallback: Function) - begins game loop
   - stop() - stops game loop
   - pause() - pauses without stopping
   - resume() - resumes from pause
   - getFPS() - returns current FPS
   - getDeltaTime() - returns time since last frame
2. Use requestAnimationFrame for 60 FPS target
3. Calculate delta time for frame-independent movement
4. Track FPS for performance monitoring

TDD Approach:
- Create game-loop.service.spec.ts
- Write tests for:
  * start calls updateCallback repeatedly
  * stop cancels animation frame
  * pause stops calling updateCallback but doesn't cancel loop
  * resume restarts updateCallback calls
  * getDeltaTime returns milliseconds since last frame
  * getFPS returns approximate frame rate
- Mock requestAnimationFrame and performance.now()
- Use jasmine.clock() for time-based testing
- Implement service to pass tests

Deliverable: Game loop service with precise timing and FPS tracking
```