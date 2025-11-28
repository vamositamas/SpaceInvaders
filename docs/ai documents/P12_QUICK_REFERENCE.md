# P12 Quick Reference: Game Entity Models

## Import
```typescript
import {
  Position, Size, Entity,
  Player, Enemy, Projectile, Shield,
  GameState, GameStatus,
  createPlayer, createEnemy, createProjectile, createShield,
  createInitialGameState
} from '@core/models';
```

## Interfaces

### Position
```typescript
interface Position {
  x: number;
  y: number;
}
```

### Size
```typescript
interface Size {
  width: number;
  height: number;
}
```

### Entity (Base)
```typescript
interface Entity {
  position: Position;
  size: Size;
  isActive: boolean;
}
```

### Player
```typescript
interface Player extends Entity {
  lives: number;
  speed: number;
  lastFireTime: number;
}
```

### Enemy
```typescript
interface Enemy extends Entity {
  type: string;           // 'squid' | 'crab' | 'octopus'
  pointValue: number;     // 30, 20, or 10
  row: number;
  col: number;
}
```

### Projectile
```typescript
interface Projectile extends Entity {
  velocity: { x: number; y: number };
  ownerId: string;        // 'player' or 'enemy'
}
```

### Shield
```typescript
interface Shield extends Entity {
  health: number;
  maxHealth: number;
}
```

### GameStatus
```typescript
enum GameStatus {
  READY = 'READY',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  GAME_OVER = 'GAME_OVER',
  LEVEL_COMPLETE = 'LEVEL_COMPLETE'
}
```

### GameState
```typescript
interface GameState {
  score: number;
  level: number;
  lives: number;
  status: GameStatus;
  isPaused: boolean;
  player: Player;
  enemies: Enemy[];
  projectiles: Projectile[];
  shields: Shield[];
}
```

## Factory Functions

### createPlayer
```typescript
createPlayer(
  x: number,
  y: number,
  speed: number = 5,
  lives: number = 3
): Player

// Example
const player = createPlayer(400, 550);
// Returns: { position: {x: 400, y: 550}, size: {width: 40, height: 20},
//           isActive: true, lives: 3, speed: 5, lastFireTime: 0 }
```

### createEnemy
```typescript
createEnemy(
  x: number,
  y: number,
  type: string,
  row: number,
  col: number
): Enemy

// Example
const enemy = createEnemy(100, 100, 'squid', 0, 5);
// Returns: { position: {x: 100, y: 100}, size: {width: 30, height: 20},
//           isActive: true, type: 'squid', pointValue: 30, row: 0, col: 5 }
```

**Enemy Types & Points:**
- `'squid'` → 30 points
- `'crab'` → 20 points
- `'octopus'` → 10 points

### createProjectile
```typescript
createProjectile(
  x: number,
  y: number,
  velocityY: number,
  ownerId: string
): Projectile

// Example - Player projectile (upward)
const bullet = createProjectile(400, 500, -5, 'player');
// Returns: { position: {x: 400, y: 500}, size: {width: 4, height: 10},
//           isActive: true, velocity: {x: 0, y: -5}, ownerId: 'player' }

// Example - Enemy projectile (downward)
const bomb = createProjectile(150, 200, 5, 'enemy');
```

### createShield
```typescript
createShield(
  x: number,
  y: number,
  health: number = 100
): Shield

// Example
const shield = createShield(200, 450);
// Returns: { position: {x: 200, y: 450}, size: {width: 60, height: 40},
//           isActive: true, health: 100, maxHealth: 100 }
```

### createInitialGameState
```typescript
createInitialGameState(): GameState

// Example
const state = createInitialGameState();
// Returns: { score: 0, level: 1, lives: 3, status: GameStatus.READY,
//           isPaused: false, player: Player, enemies: [], projectiles: [], shields: [] }
```

## Usage Examples

### Initialize Game
```typescript
// Create initial state
let gameState = createInitialGameState();

// Create enemies
const enemies: Enemy[] = [];
for (let row = 0; row < 5; row++) {
  for (let col = 0; col < 11; col++) {
    const type = row < 1 ? 'squid' : row < 3 ? 'crab' : 'octopus';
    const x = 100 + col * 50;
    const y = 50 + row * 40;
    enemies.push(createEnemy(x, y, type, row, col));
  }
}

// Create shields
const shields: Shield[] = [
  createShield(150, 450),
  createShield(350, 450),
  createShield(550, 450)
];

// Update state
gameState = { ...gameState, enemies, shields, status: GameStatus.PLAYING };
```

### Player Fires
```typescript
const player = gameState.player;
const now = Date.now();
const fireDelay = 500; // ms

if (now - player.lastFireTime > fireDelay) {
  const projectile = createProjectile(
    player.position.x + player.size.width / 2,
    player.position.y,
    -5,
    'player'
  );
  
  gameState = {
    ...gameState,
    projectiles: [...gameState.projectiles, projectile],
    player: { ...player, lastFireTime: now }
  };
}
```

### Update Projectiles
```typescript
gameState = {
  ...gameState,
  projectiles: gameState.projectiles
    .map(p => ({
      ...p,
      position: {
        x: p.position.x + p.velocity.x,
        y: p.position.y + p.velocity.y
      }
    }))
    .filter(p => p.position.y > 0 && p.position.y < 600) // Remove off-screen
};
```

### Check Collision
```typescript
function checkCollision(entity1: Entity, entity2: Entity): boolean {
  return (
    entity1.position.x < entity2.position.x + entity2.size.width &&
    entity1.position.x + entity1.size.width > entity2.position.x &&
    entity1.position.y < entity2.position.y + entity2.size.height &&
    entity1.position.y + entity1.size.height > entity2.position.y
  );
}

// Check player projectile hits enemy
gameState.projectiles
  .filter(p => p.ownerId === 'player')
  .forEach(projectile => {
    gameState.enemies.forEach(enemy => {
      if (checkCollision(projectile, enemy)) {
        // Handle collision
        gameState = {
          ...gameState,
          score: gameState.score + enemy.pointValue,
          enemies: gameState.enemies.map(e => 
            e === enemy ? { ...e, isActive: false } : e
          ),
          projectiles: gameState.projectiles.map(p =>
            p === projectile ? { ...p, isActive: false } : p
          )
        };
      }
    });
  });
```

### Pause/Resume Game
```typescript
// Pause
gameState = {
  ...gameState,
  status: GameStatus.PAUSED,
  isPaused: true
};

// Resume
gameState = {
  ...gameState,
  status: GameStatus.PLAYING,
  isPaused: false
};
```

### Game Over
```typescript
if (gameState.player.lives <= 0) {
  gameState = {
    ...gameState,
    status: GameStatus.GAME_OVER,
    isPaused: true
  };
}
```

### Level Complete
```typescript
const activeEnemies = gameState.enemies.filter(e => e.isActive);
if (activeEnemies.length === 0) {
  gameState = {
    ...gameState,
    status: GameStatus.LEVEL_COMPLETE,
    level: gameState.level + 1
  };
}
```

## Default Sizes

| Entity     | Width | Height |
|------------|-------|--------|
| Player     | 40    | 20     |
| Enemy      | 30    | 20     |
| Projectile | 4     | 10     |
| Shield     | 60    | 40     |

## Default Values

| Property          | Default |
|-------------------|---------|
| Player Speed      | 5       |
| Player Lives      | 3       |
| Shield Health     | 100     |
| Initial Score     | 0       |
| Initial Level     | 1       |
| Player Position   | (400, 550) |

## Immutability Patterns

Always use spread operator for updates:

```typescript
// ✅ Good - Immutable update
gameState = {
  ...gameState,
  score: gameState.score + 10
};

// ❌ Bad - Mutating state
gameState.score += 10;

// ✅ Good - Immutable array update
gameState = {
  ...gameState,
  enemies: gameState.enemies.filter(e => e.isActive)
};

// ❌ Bad - Mutating array
gameState.enemies = gameState.enemies.filter(e => e.isActive);
```

## Type Guards

```typescript
function isPlayer(entity: Entity): entity is Player {
  return 'lives' in entity;
}

function isEnemy(entity: Entity): entity is Enemy {
  return 'pointValue' in entity;
}

function isProjectile(entity: Entity): entity is Projectile {
  return 'velocity' in entity;
}

function isShield(entity: Entity): entity is Shield {
  return 'health' in entity;
}
```

## Common Patterns

### Filter Active Entities
```typescript
const activeEnemies = gameState.enemies.filter(e => e.isActive);
const activeProjectiles = gameState.projectiles.filter(p => p.isActive);
```

### Get All Entities
```typescript
const allEntities: Entity[] = [
  gameState.player,
  ...gameState.enemies,
  ...gameState.projectiles,
  ...gameState.shields
];
```

### Count Active
```typescript
const activeEnemyCount = gameState.enemies.filter(e => e.isActive).length;
const totalScore = gameState.enemies
  .filter(e => !e.isActive)
  .reduce((sum, e) => sum + e.pointValue, 0);
```

---

**File:** `/src/app/core/models/game-entities.model.ts`  
**Tests:** 56 tests (35 entity + 21 state)  
**Coverage:** 100%
