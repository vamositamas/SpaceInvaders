### Prompt 3.5: Mystery Ship Feature

```
Create mystery ship that periodically crosses the top of screen.

Requirements:
1. Create /src/app/core/services/mystery-ship.service.ts with:
   - shouldSpawnMysteryShip(lastSpawnTime, currentTime): boolean - random spawn check
   - createMysteryShip(canvasWidth): Enemy | null - creates ship at screen edge
   - updateMysteryShip(ship, deltaTime, canvasWidth): Enemy | null - moves ship
   - getMysteryShipPoints(): number - random points between 50-300
2. Mystery ship appears every 20-40 seconds (random)
3. Moves horizontally across top of screen
4. Worth random points: 50, 100, 150, 200, 250, or 300
5. Disappears when reaching opposite edge

TDD Approach:
- Create mystery-ship.service.spec.ts
- Write tests for:
  * shouldSpawnMysteryShip returns false if spawned recently
  * shouldSpawnMysteryShip returns true after cooldown (with randomness)
  * createMysteryShip places ship at left or right edge
  * createMysteryShip positions ship at top of canvas
  * updateMysteryShip moves ship horizontally
  * updateMysteryShip removes ship when off-screen
  * getMysteryShipPoints returns value between 50-300
  * getMysteryShipPoints returns multiple of 50
- Mock Math.random() for predictable testing
- Implement mystery-ship.service.ts

Deliverable: Mystery ship feature with random scoring
```
