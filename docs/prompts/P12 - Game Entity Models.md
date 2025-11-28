### Prompt 2.3: Game Entity Models

```
Create TypeScript models/interfaces for all game entities.

Requirements:
1. Create /src/app/core/models/game-entities.model.ts with interfaces:
   - Position {x: number, y: number}
   - Size {width: number, height: number}
   - Entity {position: Position, size: Size, isActive: boolean}
   - Player extends Entity {lives: number, speed: number, lastFireTime: number}
   - Projectile extends Entity {velocity: {x: number, y: number}, ownerId: string}
   - Enemy extends Entity {type: string, pointValue: number, row: number, col: number}
   - Shield extends Entity {health: number, maxHealth: number}
2. Create /src/app/core/models/game-state.model.ts with:
   - GameState interface {score, level, lives, isPaused, enemies[], player, projectiles[], shields[]}
3. Create utility functions:
   - createPlayer(x, y): Player
   - createEnemy(x, y, type, row, col): Enemy
   - createProjectile(x, y, velocityY, ownerId): Projectile

TDD Approach:
- Create game-entities.model.spec.ts
- Write tests for:
  * createPlayer returns Player with correct defaults
  * createEnemy returns Enemy with proper type and points
  * createProjectile returns Projectile with velocity
  * All entities have required properties
  * Type checking works correctly
- Implement model functions
- Ensure TypeScript compilation succeeds with strict mode

Deliverable: Complete game entity type system with factory functions
```