### Prompt 3.2: Enemy Movement Logic

```
Create enemy movement system with horizontal sweep and descent pattern.

Requirements:
1. Create /src/app/core/services/enemy-movement.service.ts with:
   - initMovement(): MovementState - returns {direction: 1, shouldDescend: false, speed: 1}
   - updateEnemyPositions(enemies[], movementState, deltaTime, canvasWidth): Enemy[]
   - checkEdgeCollision(enemies[], canvasWidth): boolean - checks if any enemy hit edge
   - descendEnemies(enemies[], descendAmount): Enemy[] - moves all down
   - reverseDirection(movementState): MovementState - flips direction
2. Enemies move together as a group horizontally
3. When edge reached: descend one row and reverse direction
4. Movement speed increases as enemies are destroyed

TDD Approach:
- Create enemy-movement.service.spec.ts
- Write tests for:
  * initMovement returns starting state with direction=1
  * updateEnemyPositions moves enemies right when direction=1
  * updateEnemyPositions moves enemies left when direction=-1
  * Movement uses speed * deltaTime for frame independence
  * checkEdgeCollision returns true when rightmost enemy hits right edge
  * checkEdgeCollision returns true when leftmost enemy hits left edge
  * descendEnemies moves all enemies down by amount
  * reverseDirection flips direction from 1 to -1 and vice versa
  * Speed increases when fewer enemies remain
- Implement enemy-movement.service.ts
- Handle edge detection with enemy width

Deliverable: Enemy movement system with edge detection
```
