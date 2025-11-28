# Space Invaders - TDD Implementation Prompts

## Phase 1: Project Setup & Core Infrastructure

### Prompt 1.1: Backend Project Initialization

```
Create a Node.js Express backend project with the following structure and setup:

Requirements:
1. Initialize a Node.js project with package.json
2. Install dependencies: express (4.x), socket.io (4.x), cors, dotenv
3. Install dev dependencies: jest, supertest, eslint, prettier, nodemon
4. Create folder structure:
   - /src (controllers, services, routes, middleware, models, utils, websocket)
   - /data (highscores, settings, config)
   - /tests (unit, integration)
5. Configure Jest in package.json with test script
6. Create .env file with: NODE_ENV=development, PORT=3000, ALLOWED_ORIGINS=http://localhost:4200
7. Create basic server.js that starts Express on PORT from .env
8. Add scripts to package.json: "start", "dev" (using nodemon), "test"

TDD Approach:
- Write a test file /tests/integration/server.test.js that verifies the server starts and responds to GET /health with status 200
- Run test (it should fail)
- Implement minimal server.js with express app and /health endpoint
- Make test pass
- Create .eslintrc.json and .prettierrc config files

Deliverable: Working Node.js project structure with passing health check test
```

### Prompt 1.2: File Storage Service with TDD

```
Create a file-based storage service for JSON data with comprehensive testing.

Requirements:
1. Create /src/services/file-storage.service.js with methods:
   - readJSON(filepath) - reads and parses JSON file
   - writeJSON(filepath, data) - writes JSON with pretty printing
   - ensureDirectory(dirPath) - creates directory if not exists
   - backupFile(filepath) - creates .backup copy
2. Handle errors gracefully (file not found, parse errors, write errors)
3. Use Node.js fs/promises for async operations

TDD Approach:
- First, create /tests/unit/services/file-storage.service.test.js
- Write tests for:
  * readJSON returns parsed data for valid JSON file
  * readJSON throws error for non-existent file
  * readJSON throws error for invalid JSON
  * writeJSON creates file with formatted JSON
  * writeJSON creates parent directories if needed
  * ensureDirectory creates nested directories
  * backupFile creates copy with .backup extension
- Run tests (all should fail initially)
- Implement file-storage.service.js to make each test pass
- Refactor for code quality

Use jest.mock('fs/promises') for testing without actual file I/O.

Deliverable: Fully tested file storage service with 100% coverage
```

### Prompt 1.3: Game Configuration Service

```
Create a configuration management service that loads and validates game settings.

Requirements:
1. Create /data/config/default-config.json with:
   {
     "canvas": {"width": 800, "height": 600},
     "player": {"speed": 5, "fireRate": 500, "lives": 3},
     "enemies": {"rows": 5, "columns": 11, "baseSpeed": 1, "speedIncrement": 0.1, "fireRate": 2000},
     "difficulty": {
       "easy": {"speedMultiplier": 0.75, "fireRateMultiplier": 1.5},
       "normal": {"speedMultiplier": 1.0, "fireRateMultiplier": 1.0},
       "hard": {"speedMultiplier": 1.5, "fireRateMultiplier": 0.5}
     }
   }
2. Create /src/services/config.service.js with methods:
   - loadConfig() - loads config from file or returns default
   - getConfig() - returns current config
   - updateConfig(updates) - merges updates with existing config
   - resetToDefault() - restores default configuration
3. Create /src/models/schemas.js with config validation schema

TDD Approach:
- Create /tests/unit/services/config.service.test.js
- Write tests for:
  * loadConfig returns default config on first load
  * loadConfig returns saved config if file exists
  * getConfig returns current configuration
  * updateConfig merges partial updates correctly
  * resetToDefault restores original settings
  * Invalid config values are rejected
- Implement config.service.js using file-storage.service
- Make all tests pass

Deliverable: Configuration service with validation and testing
```

### Prompt 1.4: High Score Data Service

```
Create a high score persistence service with data validation and backup.

Requirements:
1. Create /src/models/schemas.js (if not exists) and add:
   - highScoreSchema with fields: id, playerName, score, level, date, duration
   - Validation: playerName (string, 1-20 chars), score (number >= 0), level (number >= 1)
2. Create /src/services/highscore.service.js with methods:
   - getAllHighScores() - returns sorted array (top scores first)
   - addHighScore(scoreData) - adds and validates new score
   - getTopScores(limit) - returns top N scores
   - isHighScore(score) - checks if score qualifies for top 100
   - clearAllScores() - resets high score table (for testing)
3. Initialize /data/highscores/highscores.json with empty structure

TDD Approach:
- Create /tests/unit/services/highscore.service.test.js
- Write tests for:
  * getAllHighScores returns empty array initially
  * addHighScore adds valid score and returns it
  * addHighScore rejects invalid data (negative score, empty name)
  * addHighScore generates unique ID for each score
  * getTopScores returns limited sorted results
  * Scores are sorted by score descending
  * isHighScore returns true/false correctly
  * Maximum 100 scores are kept (oldest removed)
- Implement highscore.service.js using file-storage.service
- Make tests pass with proper validation

Deliverable: High score service with validation and 100-score limit
```

### Prompt 1.5: REST API Endpoints for Configuration

```
Create Express REST API endpoints for game configuration.

Requirements:
1. Create /src/routes/config.routes.js with routes:
   - GET /api/config - returns current configuration
   - PUT /api/config - updates configuration (validate input)
   - POST /api/config/reset - resets to default
2. Create /src/controllers/config.controller.js with handler functions
3. Create /src/middleware/validation.js for request validation
4. Update server.js to use config.routes with express.json() middleware
5. Add proper error handling middleware

TDD Approach:
- Create /tests/integration/config.routes.test.js
- Write tests using supertest:
  * GET /api/config returns 200 with config object
  * PUT /api/config with valid data returns 200 and updated config
  * PUT /api/config with invalid data returns 400 error
  * POST /api/config/reset returns 200 and default config
  * Routes return proper JSON content-type
- Implement routes, controller, and validation
- Wire everything in server.js
- Make all tests pass

Deliverable: Working config API endpoints with validation
```

### Prompt 1.6: 

```REST API Endpoints for High Scores
Create Express REST API endpoints for high score management.

Requirements:
1. Create /src/routes/highscore.routes.js with routes:
   - GET /api/highscores?limit=10 - get top scores with pagination
   - POST /api/highscores - submit new high score
   - GET /api/highscores/:id - get specific score
   - DELETE /api/highscores/:id - delete score
2. Create /src/controllers/highscore.controller.js with handlers
3. Add validation middleware for POST requests
4. Update server.js to use highscore.routes

TDD Approach:
- Create /tests/integration/highscore.routes.test.js
- Write tests for:
  * GET /api/highscores returns array of scores
  * GET /api/highscores?limit=5 returns max 5 scores
  * POST /api/highscores with valid data returns 201 and created score
  * POST /api/highscores with invalid data returns 400
  * GET /api/highscores/:id returns specific score or 404
  * DELETE /api/highscores/:id returns 204 on success
- Implement controller methods using highscore.service
- Wire routes in server.js
- Verify all tests pass

Deliverable: Complete high score REST API with CRUD operations
```

## Phase 2: Game Engine Core

### Prompt 2.1: Angular Project Setup

```
Create an Angular frontend project with Material Design and testing setup.

Requirements:
1. Generate new Angular project: ng new space-invaders-client --routing --style=scss
2. Install Angular Material: ng add @angular/material (choose theme)
3. Create folder structure in /src/app:
   - /core (services, models, guards)
   - /features (game, menu, game-over)
   - /shared (components, pipes, utils)
4. Configure proxy for API: create proxy.conf.json pointing /api to http://localhost:3000
5. Update angular.json to use proxy in serve configuration
6. Install testing dependencies: ensure Jasmine and Karma are configured
7. Create app routing with lazy-loaded feature modules

TDD Approach:
- Create app.component.spec.ts test that verifies component creates successfully
- Run ng test (should pass basic test)
- Create core.module.ts and shared.module.ts
- Generate feature modules: ng generate module features/game --route game --module app.module
- Verify routing works with a simple test
- Set up Material theme in styles.scss

Deliverable: Angular project structure with Material Design and routing
```

### Prompt 2.2: Game Canvas Service

```
Create an Angular service to manage HTML5 Canvas rendering with testing.

Requirements:
1. Create /src/app/core/services/canvas.service.ts with methods:
   - initCanvas(canvasElement, width, height) - initializes canvas context
   - clearCanvas() - clears entire canvas
   - getContext() - returns 2D rendering context
   - drawRect(x, y, width, height, color) - draws filled rectangle
   - drawText(text, x, y, font, color) - renders text
2. Use CanvasRenderingContext2D for all drawing operations
3. Store canvas dimensions and context as private properties

TDD Approach:
- Create canvas.service.spec.ts
- Write tests for:
  * initCanvas stores canvas context correctly
  * clearCanvas clears entire canvas area
  * getContext returns stored 2D context
  * drawRect calls fillRect with correct parameters
  * drawText calls fillText with proper positioning
  * Methods throw error if canvas not initialized
- Mock CanvasRenderingContext2D in tests
- Implement canvas.service.ts to pass all tests
- Use TestBed for Angular service testing

Deliverable: Canvas service with full unit test coverage
```

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

### Prompt 2.5: Input Handler Service

```
Create a service to handle keyboard and mouse input for game controls.

Requirements:
1. Create /src/app/core/services/input-handler.service.ts with:
   - enableKeyboard() - starts listening to keyboard events
   - enableMouse(canvasElement) - starts listening to mouse events
   - disable() - removes all event listeners
   - isKeyPressed(key: string): boolean
   - getMouseX(): number
   - isMouseButtonPressed(button: number): boolean
2. Track key states in a Map (key -> boolean)
3. Track mouse position relative to canvas
4. Support keys: ArrowLeft, ArrowRight, KeyA, KeyD, Space, KeyW, ArrowUp, KeyP, Escape
5. Handle mouse movement and click events

TDD Approach:
- Create input-handler.service.spec.ts
- Write tests for:
  * enableKeyboard registers keydown/keyup listeners
  * isKeyPressed returns true when key is down
  * isKeyPressed returns false when key is up
  * enableMouse registers mouse event listeners
  * getMouseX returns correct X position relative to canvas
  * isMouseButtonPressed tracks mouse button state
  * disable removes all event listeners
- Mock window.addEventListener and canvas element
- Simulate keyboard and mouse events in tests
- Implement service with proper cleanup

Deliverable: Input handler with keyboard and mouse support
```

### Prompt 2.6: Player Entity and Movement

```
Create player ship logic with movement controls and boundaries.

Requirements:
1. Create /src/app/core/services/player.service.ts with:
   - createPlayer(canvasWidth): Player - initializes player at bottom center
   - updatePlayer(player, input, deltaTime, canvasWidth) - updates position based on input
   - canPlayerFire(player, currentTime): boolean - checks fire rate cooldown
   - fireProjectile(player, currentTime): Projectile - creates player projectile
2. Player moves horizontally based on keyboard (A/D or Arrows) or mouse X
3. Player stays within canvas boundaries (0 to canvasWidth - playerWidth)
4. Fire rate limited to once per 500ms

TDD Approach:
- Create player.service.spec.ts
- Write tests for:
  * createPlayer places player at bottom center
  * updatePlayer moves left when ArrowLeft pressed
  * updatePlayer moves right when ArrowRight pressed
  * updatePlayer follows mouse X position when mouse enabled
  * updatePlayer respects left boundary (x >= 0)
  * updatePlayer respects right boundary (x <= canvas width - player width)
  * canPlayerFire returns false if fired recently
  * canPlayerFire returns true after cooldown period
  * fireProjectile creates projectile above player
  * fireProjectile updates player lastFireTime
- Implement player.service.ts to pass all tests
- Use deltaTime for smooth frame-independent movement

Deliverable: Player service with movement and shooting logic
```

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

### Prompt 2.8: Projectile System

```
Create projectile management system for player and enemy bullets.

Requirements:
1. Create /src/app/core/services/projectile.service.ts with:
   - createProjectile(x, y, velocityY, ownerId): Projectile
   - updateProjectiles(projectiles[], deltaTime, canvasHeight): Projectile[] - moves and filters
   - removeInactiveProjectiles(projectiles[]): Projectile[] - filters out-of-bounds
2. Projectiles move vertically at constant speed
3. Player projectiles move up (negative velocity)
4. Enemy projectiles move down (positive velocity)
5. Remove projectiles that go off-screen

TDD Approach:
- Create projectile.service.spec.ts
- Write tests for:
  * createProjectile returns Projectile with correct properties
  * updateProjectiles moves projectile by velocity * deltaTime
  * Player projectile (negative velocity) moves upward
  * Enemy projectile (positive velocity) moves downward
  * removeInactiveProjectiles filters projectiles above canvas (y < 0)
  * removeInactiveProjectiles filters projectiles below canvas (y > height)
  * Active projectiles remain in array
- Implement projectile.service.ts
- Use frame-independent movement with deltaTime

Deliverable: Projectile system with physics and cleanup
```

### Prompt 2.9: Collision Detection Service

```
Create collision detection system for axis-aligned bounding boxes (AABB).

Requirements:
1. Create /src/app/core/services/collision.service.ts with:
   - checkCollision(entityA, entityB): boolean - AABB collision check
   - checkProjectileEnemyCollisions(projectiles[], enemies[]): {projectile, enemy}[]
   - checkProjectilePlayerCollisions(projectiles[], player): Projectile | null
   - checkProjectileShieldCollisions(projectiles[], shields[]): {projectile, shield}[]
2. Use bounding box collision: overlap in both X and Y axes
3. Return collision pairs for processing
4. Only check collisions for active entities

TDD Approach:
- Create collision.service.spec.ts
- Write tests for:
  * checkCollision returns true when boxes overlap
  * checkCollision returns false when boxes don't overlap
  * checkCollision handles edge touching correctly
  * checkProjectileEnemyCollisions finds all colliding pairs
  * checkProjectileEnemyCollisions ignores inactive entities
  * checkProjectilePlayerCollisions detects player hits
  * checkProjectilePlayerCollisions ignores player's own projectiles
  * checkProjectileShieldCollisions finds shield hits
- Implement efficient AABB collision detection
- Test edge cases (exact alignment, single pixel overlap)

Deliverable: Collision detection service with comprehensive testing
```

### Prompt 2.10: Integrate Projectiles and Collisions

```
Integrate projectile shooting and collision detection into the game.

Requirements:
1. Update game-canvas.component.ts to:
   - Store projectiles array in component state
   - Handle spacebar/click to fire player projectiles
   - Update all projectiles each frame
   - Check for collisions each frame
   - Remove collided projectiles
   - Draw all projectiles on canvas
2. Inject ProjectileService and CollisionService
3. Add visual feedback (console.log) for collisions temporarily
4. Draw projectiles as small rectangles

TDD Approach:
- Update game-canvas.component.spec.ts with:
  * Projectiles array initializes empty
  * Spacebar press creates new projectile
  * Mouse click creates new projectile
  * Fire rate cooldown is respected
  * updateProjectiles called each frame
  * Collision detection runs each frame
  * Collided projectiles are removed
  * Projectiles render on canvas
- Mock ProjectileService and CollisionService
- Verify integration with existing player system
- Implement and make tests pass

Deliverable: Working shooting mechanism with collision detection
```

## Phase 3: Enemy System

### Prompt 3.1: Enemy Entity Service

```
Create enemy entity management with different types and point values.

Requirements:
1. Create /src/app/core/services/enemy.service.ts with:
   - createEnemyGrid(rows, columns, canvasWidth): Enemy[] - creates full grid
   - getEnemyType(row): string - returns type based on row ('top', 'middle', 'bottom')
   - getPointValue(type): number - returns points (30, 20, or 10)
   - removeEnemy(enemies[], enemy): Enemy[] - removes specific enemy
   - getActiveEnemies(enemies[]): Enemy[] - filters active enemies
2. Enemy types: top row = 30pts, middle rows = 20pts, bottom rows = 10pts
3. Grid layout: 5 rows × 11 columns with spacing
4. Initial positioning centered on canvas

TDD Approach:
- Create enemy.service.spec.ts
- Write tests for:
  * createEnemyGrid returns 55 enemies (5×11)
  * Enemies positioned in correct grid formation
  * getEnemyType returns 'top' for row 0
  * getEnemyType returns 'middle' for rows 1-2
  * getEnemyType returns 'bottom' for rows 3-4
  * getPointValue returns correct points for each type
  * removeEnemy marks enemy as inactive
  * getActiveEnemies filters out inactive enemies
  * Grid is horizontally centered on canvas
- Implement enemy.service.ts
- Use consistent spacing between enemies

Deliverable: Enemy grid generation with types and scoring
```

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

### Prompt 3.3: Enemy Shooting Logic

```
Create enemy shooting system with random firing from bottom row.

Requirements:
1. Create /src/app/core/services/enemy-shooting.service.ts with:
   - getBottomRowEnemies(enemies[]): Enemy[] - finds lowest active enemies per column
   - canEnemyFire(lastFireTime, currentTime, fireRate): boolean - checks cooldown
   - selectRandomShooter(bottomEnemies[]): Enemy | null - picks random enemy
   - createEnemyProjectile(enemy): Projectile - creates downward projectile
2. Only bottom-most enemy in each column can fire
3. Fire rate: approximately every 2000ms per column
4. Random selection from available shooters
5. Enemy projectiles move downward

TDD Approach:
- Create enemy-shooting.service.spec.ts
- Write tests for:
  * getBottomRowEnemies returns one enemy per column
  * getBottomRowEnemies returns lowest enemy when multiple in column
  * getBottomRowEnemies handles empty columns
  * canEnemyFire returns false if fired too recently
  * canEnemyFire returns true after cooldown period
  * selectRandomShooter returns enemy from provided array
  * selectRandomShooter returns null if array empty
  * createEnemyProjectile creates projectile below enemy
  * createEnemyProjectile sets positive (downward) velocity
- Implement enemy-shooting.service.ts
- Use Math.random() for selection (mock in tests)

Deliverable: Enemy shooting system with random firing
```

### Prompt 3.4: Integrate Enemy System into Game

```
Integrate enemy grid, movement, and shooting into the game canvas.

Requirements:
1. Update game-canvas.component.ts to:
   - Create enemy grid on game start
   - Store enemies array and movementState
   - Update enemy positions each frame
   - Handle edge collision and descent
   - Trigger enemy shooting at intervals
   - Check projectile-enemy collisions
   - Remove destroyed enemies
   - Draw enemies on canvas (different colors per type)
2. Inject EnemyService, EnemyMovementService, EnemyShooting Service
3. Add score tracking when enemies destroyed
4. Draw enemies as rectangles with type-specific colors

TDD Approach:
- Update game-canvas.component.spec.ts:
  * Enemies array initializes with 55 enemies
  * Enemy positions update each frame
  * Edge collision triggers descent
  * Direction reverses after descent
  * Enemies fire projectiles at intervals
  * Projectile hits remove enemies
  * Score increases by enemy point value
  * Destroyed enemies don't render
  * All enemy types render with correct colors
- Mock all enemy services
- Implement integration
- Verify tests pass

Deliverable: Fully functional enemy system integrated into gameplay
```

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

### Prompt 3.6: Level Progression System

```
Create level progression with increasing difficulty and wave management.

Requirements:
1. Create /src/app/core/services/level.service.ts with:
   - initLevel(levelNumber): LevelConfig - returns config for level
   - calculateEnemySpeed(baseSpeed, level): number - increases speed per level
   - calculateFireRate(baseRate, level): number - decreases fire cooldown
   - isLevelComplete(enemies[]): boolean - checks if all enemies destroyed
   - startNextLevel(currentLevel): number - increments level
2. Difficulty scaling: speed increases 10% per level, fire rate decreases 5%
3. Level complete when all enemies destroyed
4. New wave spawns with increased difficulty

TDD Approach:
- Create level.service.spec.ts
- Write tests for:
  * initLevel returns config for level 1
  * calculateEnemySpeed returns baseSpeed * 1.1 for level 2
  * calculateEnemySpeed scales correctly for higher levels
  * calculateFireRate reduces cooldown per level
  * isLevelComplete returns true when no active enemies
  * isLevelComplete returns false when enemies remain
  * startNextLevel increments level counter
- Implement level.service.ts
- Cap maximum difficulty at reasonable level

Deliverable: Level progression with difficulty scaling
```

### Prompt 3.7: Integrate Level System

```
Integrate level progression and victory conditions into game.

Requirements:
1. Update game-canvas.component.ts to:
   - Track current level number
   - Check for level completion each frame
   - Start next level when complete
   - Reset enemy grid with new level config
   - Apply difficulty modifiers to movement and shooting
   - Show level number in console (HUD later)
2. Inject LevelService
3. Handle level transition (brief pause before next wave)

TDD Approach:
- Update game-canvas.component.spec.ts:
  * Level initializes to 1
  * isLevelComplete checked each frame
  * New enemy grid spawns when level complete
  * Level number increments after completion
  * Enemy speed increases in next level
  * Enemy fire rate increases in next level
  * Level transition has brief delay
- Mock LevelService
- Implement level progression flow
- Verify multi-level gameplay

Deliverable: Working level system with progressive difficulty
```

## Phase 4: Game Features & Shields

### Prompt 4.1: Shield Entity System

```
Create destructible shield/barrier system with health tracking.

Requirements:
1. Create /src/app/core/services/shield.service.ts with:
   - createShields(count, canvasWidth, playerY): Shield[] - creates 4 shields
   - damageShield(shield, damage): Shield - reduces health
   - isShieldDestroyed(shield): boolean - checks if health <= 0
   - removeDestroyedShields(shields[]): Shield[] - filters destroyed
2. Shields positioned between player and enemies
3. Each shield has health (e.g., 100 points)
4. Damage from projectiles reduces health by 10
5. Shield becomes inactive when health reaches 0

TDD Approach:
- Create shield.service.spec.ts
- Write tests for:
  * createShields returns 4 shields
  * Shields evenly spaced across canvas width
  * Shields positioned above player but below enemies
  * damageShield reduces health by damage amount
  * damageShield doesn't reduce health below 0
  * isShieldDestroyed returns true when health = 0
  * isShieldDestroyed returns false when health > 0
  * removeDestroyedShields filters shields with health <= 0
  * Active shields remain after filtering
- Implement shield.service.ts
- Position shields at appropriate Y coordinate

Deliverable: Shield system with health and destruction
```

### Prompt 4.2: Shield Collision and Damage

```
Integrate shield collisions with projectiles.

Requirements:
1. Update collision.service.ts to add:
   - checkProjectileShieldCollisions(projectiles[], shields[]): CollisionPair[]
2. Update game-canvas.component.ts to:
   - Create shields on game start
   - Check projectile-shield collisions each frame
   - Apply damage to shields when hit
   - Remove colliding projectiles
   - Remove destroyed shields
   - Draw shields with health-based opacity
3. Both player and enemy projectiles damage shields

TDD Approach:
- Update collision.service.spec.ts:
  * checkProjectileShieldCollisions finds projectile-shield pairs
  * Collisions detected for both player and enemy projectiles
  * Inactive shields ignored in collision checks
- Update game-canvas.component.spec.ts:
  * Shields array initializes with 4 shields
  * Projectile collision with shield reduces shield health
  * Colliding projectile removed from game
  * Shield removed when health reaches 0
  * Shield opacity reflects remaining health
- Implement collision handling
- Visual feedback for shield damage

Deliverable: Shields that degrade when hit by projectiles
```

### Prompt 4.3: Lives System

```
Create player lives system with hit detection and game over.

Requirements:
1. Create /src/app/core/services/lives.service.ts with:
   - initLives(maxLives): number - starts with 3 lives
   - loseLife(currentLives): number - decrements lives
   - hasLivesRemaining(lives): boolean - checks if lives > 0
   - isGameOver(lives): boolean - checks if lives = 0
2. Update game-canvas.component.ts to:
   - Track player lives
   - Check enemy projectile hits on player
   - Reduce life when player hit
   - Brief invincibility after being hit (2 seconds)
   - Trigger game over when lives = 0

TDD Approach:
- Create lives.service.spec.ts:
  * initLives returns maxLives value
  * loseLife decrements lives by 1
  * loseLife doesn't go below 0
  * hasLivesRemaining returns true when lives > 0
  * hasLivesRemaining returns false when lives = 0
  * isGameOver returns true when lives = 0
- Update game-canvas.component.spec.ts:
  * Lives initialize to 3
  * Player hit reduces lives by 1
  * Player invincible for 2 seconds after hit
  * Multiple hits during invincibility don't reduce lives
  * Game over triggered at 0 lives
- Implement lives system with invincibility frames

Deliverable: Lives system with player hit detection
```

### Prompt 4.4: Scoring System

```
Create comprehensive scoring system with combo tracking.

Requirements:
1. Create /src/app/core/services/score.service.ts with:
   - initScore(): ScoreState - initializes {score: 0, combo: 0, lastKillTime: 0}
   - addScore(scoreState, points, currentTime): ScoreState - adds points
   - calculateComboMultiplier(combo): number - returns multiplier (1x, 1.5x, 2x)
   - updateCombo(scoreState, currentTime, comboWindow): ScoreState - manages combo
   - resetCombo(scoreState): ScoreState - resets combo to 0
2. Combo system: killing enemies within 1 second maintains combo
3. Combo multiplier: 3+ combo = 1.5x, 5+ combo = 2x points
4. Combo resets if no kills for 1 second

TDD Approach:
- Create score.service.spec.ts:
  * initScore returns score 0 and combo 0
  * addScore increases score by points value
  * addScore increments combo counter
  * calculateComboMultiplier returns 1 for combo < 3
  * calculateComboMultiplier returns 1.5 for combo 3-4
  * calculateComboMultiplier returns 2 for combo >= 5
  * updateCombo maintains combo if within time window
  * updateCombo resets combo if exceeds time window
  * Score includes combo multiplier
- Implement score.service.ts with timing logic

Deliverable: Scoring system with combo multipliers
```

### Prompt 4.5: Game State Management Service

```
Create centralized game state management service.

Requirements:
1. Create /src/app/core/services/game-state.service.ts with:
   - BehaviorSubjects for: score$, lives$, level$, isPaused$, gameOver$
   - updateScore(points): void - updates score observable
   - updateLives(lives): void - updates lives observable
   - updateLevel(level): void - updates level observable
   - pauseGame(): void - sets pause state
   - resumeGame(): void - clears pause state
   - resetGame(): void - resets all state to initial values
   - endGame(): void - sets game over state
2. Use RxJS BehaviorSubjects for reactive state
3. Components subscribe to observables for state updates

TDD Approach:
- Create game-state.service.spec.ts:
  * Observables emit initial values
  * updateScore emits new score value
  * updateLives emits new lives value
  * updateLevel emits new level value
  * pauseGame sets isPaused$ to true
  * resumeGame sets isPaused$ to false
  * endGame sets gameOver$ to true
  * resetGame resets all values to defaults
  * Multiple subscriptions receive updates
- Use TestScheduler for observable testing
- Implement reactive state management

Deliverable: Centralized state management with RxJS
```

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

### Prompt 4.7: Enemy-Player Collision (Game Over Condition)

```
Add game over condition when enemies reach player level.

Requirements:
1. Update collision.service.ts to add:
   - checkEnemyPlayerCollision(enemies[], player): boolean
   - checkEnemyReachedBottom(enemies[], bottomThreshold): boolean
2. Update game-canvas.component.ts to:
   - Check if any enemy collides with player
   - Check if any enemy reaches bottom threshold (player Y level)
   - Trigger immediate game over if either condition met
   - Show game over message (console.log for now)

TDD Approach:
- Update collision.service.spec.ts:
  * checkEnemyPlayerCollision detects enemy touching player
  * checkEnemyReachedBottom returns true if enemy Y >= threshold
  * Returns false when enemies above threshold
- Update game-canvas.component.spec.ts:
  * Game over triggered on enemy-player collision
  * Game over triggered when enemy reaches bottom
  * Game updates stop on game over
  * Game over state updates in GameStateService
- Implement collision checks
- Trigger game over flow

Deliverable: Game over conditions for enemy invasion
```

## Phase 5: UI/UX & Menus

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

### Prompt 5.2: Main Menu Component

```
Create main menu with Angular Material components.

Requirements:
1. Create main-menu.component.ts in /src/app/features/menu with:
   - mat-card for game title and branding
   - mat-button for: Start Game, High Scores, Settings, Instructions
   - mat-icon for decorative elements
   - Router navigation to game on Start
2. Template with Material Design styling
3. Responsive layout
4. Add CSS animations for hover effects

TDD Approach:
- Create main-menu.component.spec.ts:
  * Component renders all menu buttons
  * Start Game navigates to /game route
  * High Scores button opens high scores view
  * Settings button opens settings dialog
  * Instructions button opens instructions dialog
  * Buttons have proper accessibility labels
- Mock Router for navigation testing
- Implement component with Material components
- Verify routing and dialog triggering

Deliverable: Main menu with Material Design UI
```

### Prompt 5.3: Settings Dialog Component

```
Create settings configuration dialog with Angular Material.

Requirements:
1. Create settings-dialog.component.ts in /src/app/features/menu with:
   - mat-dialog container
   - mat-slider for sound volume (0-100)
   - mat-slider for music volume (0-100)
   - mat-slide-toggle for control scheme (keyboard/mouse/both)
   - mat-select for difficulty (easy/normal/hard)
   - Save and Cancel buttons
2. Load settings from backend API on open
3. Save settings to backend on Save button
4. Close dialog with saved/cancelled state

TDD Approach:
- Create settings-dialog.component.spec.ts:
  * Dialog opens with current settings
  * Sliders update values correctly
  * Toggle switches between control schemes
  * Dropdown shows difficulty options
  * Save button calls API to persist settings
  * Cancel button closes without saving
  * Settings applied to game services
- Mock HttpClient for API calls
- Mock MatDialogRef for dialog control
- Implement component with form handling

Deliverable: Settings dialog with persistent configuration
```

### Prompt 5.4: High Scores Component

```
Create high scores display with Angular Material table.

Requirements:
1. Create high-scores.component.ts in /src/app/features/menu with:
   - mat-table displaying rank, name, score, level, date
   - mat-paginator for pagination (10 per page)
   - mat-sort for sortable columns
   - Load scores from backend API
   - Highlight current player's score if present
2. Format date with Angular date pipe
3. Format score with number pipes (comma separators)
4. Responsive table design

TDD Approach:
- Create high-scores.component.spec.ts:
  * Component loads scores from API on init
  * Table displays all column headers
  * Scores sorted by rank (score descending)
  * Pagination shows 10 scores per page
  * Pagination controls work correctly
  * Date formatted as readable string
  * Score formatted with commas
  * Empty state shown when no scores
- Mock HttpClient with test data
- Implement component with Material table
- Verify sorting and pagination

Deliverable: High scores table with pagination
```

### Prompt 5.5: Instructions Dialog Component

```
Create game instructions dialog with Angular Material.

Requirements:
1. Create instructions-dialog.component.ts in /src/app/features/menu with:
   - mat-dialog container
   - mat-expansion-panel for sections: Controls, Gameplay, Scoring, Tips
   - Display keyboard controls with key icons
   - Display mouse controls with descriptions
   - Show enemy types and point values
   - Explain shield and lives system
2. Use mat-icon for visual control representations
3. Organized, easy-to-read layout

TDD Approach:
- Create instructions-dialog.component.spec.ts:
  * Dialog displays all instruction sections
  * Expansion panels expand/collapse correctly
  * Keyboard controls listed with icons
  * Mouse controls described clearly
  * Enemy point values shown
  * Shield mechanics explained
  * Lives system described
- Implement component with expansion panels
- Verify content completeness and clarity

Deliverable: Comprehensive instructions dialog
```

### Prompt 5.6: Game Over Screen Component

```
Create game over screen with score display and high score entry.

Requirements:
1. Create game-over.component.ts in /src/app/features/game-over with:
   - Display final score and level reached
   - Show "New High Score!" message if applicable
   - Input field for player name (if high score)
   - Submit button to save high score
   - Play Again button (restarts game)
   - Main Menu button (returns to menu)
   - Subscribe to GameStateService for game over state
2. Use Angular Material form components
3. Validate player name (1-20 characters)

TDD Approach:
- Create game-over.component.spec.ts:
  * Component displays final score
  * Component displays level reached
  * High score message shown if score qualifies
  * Name input appears for high scores
  * Name validation works (length, characters)
  * Submit button saves score to backend
  * Play Again resets game and navigates to game
  * Main Menu navigates to menu
  * Component appears on game over state
- Mock HttpClient for API submission
- Mock Router for navigation
- Implement component with forms

Deliverable: Game over screen with high score submission
```

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

## Phase 6: High Scores & Backend Integration

### Prompt 6.1: High Score Submission Flow

```
Implement end-to-end high score submission from game to backend.

Requirements:
1. Create /src/app/core/services/highscore-api.service.ts with:
   - getHighScores(limit?: number): Observable<HighScore[]>
   - submitHighScore(score: HighScore): Observable<HighScore>
   - checkIsHighScore(score: number): Observable<boolean>
   - HTTP calls to backend API endpoints
2. Update game-over.component.ts to:
   - Check if score qualifies as high score on load
   - Show name entry form if high score
   - Submit score with player name to API
   - Navigate to high scores after submission
3. Handle API errors gracefully with user feedback

TDD Approach:
- Create highscore-api.service.spec.ts:
  * getHighScores calls GET /api/highscores
  * submitHighScore calls POST /api/highscores with data
  * checkIsHighScore calls API to validate score
  * HTTP errors handled and returned as observables
  * Request headers include content-type
- Update game-over.component.spec.ts:
  * Component checks if score is high score on init
  * Name form shown only for high scores
  * Submit calls API with correct data
  * Success navigates to high scores page
  * Error shows error message to user
- Mock HttpClient with HttpClientTestingModule
- Implement API service and integration

Deliverable: Complete high score submission flow
```

### Prompt 6.2: Settings Persistence

```
Implement settings persistence between frontend and backend.

Requirements:
1. Create /src/app/core/services/settings-api.service.ts with:
   - getSettings(playerId: string): Observable<PlayerSettings>
   - saveSettings(settings: PlayerSettings): Observable<PlayerSettings>
   - HTTP calls to backend settings endpoints
2. Update settings-dialog.component.ts to:
   - Load settings from API when dialog opens
   - Save settings to API when Save clicked
   - Apply settings to game services immediately
3. Generate unique player ID in localStorage (fallback)
4. Handle new players with default settings

TDD Approach:
- Create settings-api.service.spec.ts:
  * getSettings calls GET /api/settings/:playerId
  * saveSettings calls PUT /api/settings/:playerId
  * 404 response returns default settings
  * API errors handled properly
- Update settings-dialog.component.spec.ts:
  * Settings loaded from API on open
  * Save button persists to backend
  * Settings applied to game services
  * Player ID generated if not exists
  * Default settings used for new players
- Mock HttpClient
- Implement settings persistence

Deliverable: Persistent settings across sessions
```

### Prompt 6.3: Backend Score Validation

```
Add server-side validation and anti-cheat for high scores.

Requirements:
1. Update /src/services/validation.service.js (backend) with:
   - validateHighScore(score, level, duration): boolean
   - checkScoreRealistic(score, level): boolean - score not impossibly high
   - checkDurationRealistic(duration, level): boolean - time not too short
   - sanitizePlayerName(name): string - remove invalid characters
2. Update highscore.controller.js to:
   - Validate all incoming score submissions
   - Reject invalid or suspicious scores with 400 error
   - Sanitize player name before saving
   - Rate limit score submissions per IP

TDD Approach:
- Create validation.service.test.js:
  * validateHighScore accepts valid scores
  * checkScoreRealistic rejects impossibly high scores
  * checkScoreRealistic accepts reasonable scores for level
  * checkDurationRealistic rejects too-fast completions
  * sanitizePlayerName removes SQL injection attempts
  * sanitizePlayerName removes XSS attempts
  * sanitizePlayerName trims to max length
- Update highscore.controller.test.js:
  * POST rejects scores exceeding level maximum
  * POST rejects names with invalid characters
  * POST accepts valid scores
  * Rate limiting blocks excessive submissions
- Implement validation logic
- Add rate limiting middleware

Deliverable: Secure high score submission with validation
```

### Prompt 6.4: Game Session Tracking

```
Add game session tracking for analytics and debugging.

Requirements:
1. Create /src/services/session.service.js (backend) with:
   - createSession(playerId): Session - starts new game session
   - updateSession(sessionId, gameState): Session - updates progress
   - endSession(sessionId, finalScore): Session - completes session
   - getSessionStats(): SessionStats - returns aggregate statistics
2. Create /data/logs/game-sessions.json for session storage
3. Track: start time, end time, final score, level reached, duration
4. Auto-cleanup old sessions (keep last 100)

TDD Approach:
- Create session.service.test.js:
  * createSession generates unique session ID
  * createSession stores start timestamp
  * updateSession appends state updates
  * endSession marks session complete
  * endSession calculates total duration
  * getSessionStats returns averages and totals
  * Old sessions automatically removed when limit exceeded
- Implement session tracking service
- Use file-storage.service for persistence
- Verify data integrity

Deliverable: Game session tracking and analytics
```

### Prompt 6.5: WebSocket Real-Time Updates

```
Implement WebSocket connection for real-time game state synchronization.

Requirements:
1. Create /src/websocket/game-room.js (backend) with:
   - joinRoom(socketId, playerId): void - adds player to room
   - leaveRoom(socketId): void - removes player
   - broadcastGameState(roomId, state): void - sends state to all
   - handlePlayerInput(socketId, input): void - processes input
2. Update server.js to initialize Socket.io
3. Create /src/app/core/services/websocket.service.ts (frontend) with:
   - connect(): Observable<boolean> - establishes connection
   - disconnect(): void - closes connection
   - sendInput(input): void - sends player input
   - onGameUpdate(): Observable<GameState> - receives state updates
4. Handle connection drops and reconnection

TDD Approach:
- Create game-room.test.js:
  * joinRoom adds socket to room
  * leaveRoom removes socket
  * broadcastGameState emits to all room members
  * handlePlayerInput processes input data
- Create websocket.service.spec.ts:
  * connect establishes socket connection
  * disconnect closes connection properly
  * sendInput emits data to server
  * onGameUpdate receives state updates
  * Reconnection attempted on disconnect
  * Connection status observable updates
- Mock socket.io for testing
- Implement WebSocket handling

Deliverable: Real-time WebSocket communication
```

### Prompt 6.6: Error Handling and Retry Logic

```
Add comprehensive error handling and retry logic for API calls.

Requirements:
1. Create /src/app/core/services/error-handler.service.ts with:
   - handleError(error: any): Observable<never> - processes HTTP errors
   - showErrorMessage(message: string): void - displays to user
   - logError(error: any): void - logs for debugging
2. Create /src/middleware/error-handler.js (backend) with:
   - Global error handler middleware
   - Error formatting for consistent responses
   - Error logging with stack traces
3. Add retry logic with exponential backoff for API calls
4. Display user-friendly error messages

TDD Approach:
- Create error-handler.service.spec.ts:
  * handleError converts HTTP errors to user messages
  * 404 errors show "not found" message
  * 500 errors show "server error" message
  * Network errors show "connection failed" message
  * Errors logged to console in dev mode
- Create error-handler.test.js:
  * Middleware catches all errors
  * Errors formatted with status and message
  * Stack traces included in development
  * Stack traces excluded in production
- Implement error handling
- Add retry operators to HTTP calls

Deliverable: Robust error handling across app
```

## Phase 7: Polish & Optimization

### Prompt 7.1: Performance Optimization

```
Optimize game performance for consistent 60 FPS.

Requirements:
1. Implement object pooling for projectiles:
   - Create /src/app/core/services/object-pool.service.ts
   - Pool projectile objects to avoid garbage collection
   - Reuse inactive projectiles instead of creating new
2. Optimize collision detection:
   - Implement spatial partitioning (grid-based)
   - Only check nearby entities for collisions
   - Skip inactive entities
3. Optimize canvas rendering:
   - Use requestAnimationFrame correctly
   - Only redraw changed areas if possible
   - Batch draw calls

TDD Approach:
- Create object-pool.service.spec.ts:
  * Pool creates initial object set
  * acquire() reuses inactive objects
  * acquire() creates new if pool empty
  * release() returns object to pool
  * Pool size doesn't exceed maximum
- Add performance tests:
  * Measure frame rate with 100+ entities
  * Verify consistent 60 FPS maintained
  * Memory usage stays under 200MB
  * No memory leaks over time
- Implement optimizations
- Profile with browser dev tools
- Verify performance improvements

Deliverable: Optimized game running at 60 FPS
```

### Prompt 7.2: Visual Polish and Animations

```
Add visual polish with animations and effects.

Requirements:
1. Create /src/app/core/services/particle.service.ts for particle effects:
   - createExplosion(x, y, color): Particle[] - enemy destruction
   - updateParticles(particles[], deltaTime): Particle[] - animate
   - renderParticles(particles[], canvas): void - draw
2. Add animations to game entities:
   - Enemy explosion animation on death
   - Projectile trail effect
   - Shield damage flash effect
   - Player invincibility flicker
3. Add Angular animations to UI components:
   - Menu button hover effects
   - Dialog slide-in animations
   - Score number count-up animation
   - Level transition fade effect

TDD Approach:
- Create particle.service.spec.ts:
  * createExplosion generates multiple particles
  * Particles have velocity and lifetime
  * updateParticles moves particles by velocity
  * Particles removed after lifetime expires
  * renderParticles draws each particle
- Add visual regression tests:
  * Explosion effect appears on enemy death
  * Shield flashes white when damaged
  * Player flickers during invincibility
- Implement particle system
- Add CSS/Angular animations
- Verify smooth 60 FPS maintained

Deliverable: Polished visuals with particle effects
```

### Prompt 7.3: Sound Effects Integration

```
Add sound effects and music to game (optional but recommended).

Requirements:
1. Create /src/app/core/services/audio.service.ts with:
   - loadSound(name: string, url: string): void - preloads audio
   - playSound(name: string, volume?: number): void - plays effect
   - playMusic(url: string, loop: boolean): void - plays background music
   - stopMusic(): void - stops background music
   - setVolume(soundVolume, musicVolume): void - adjusts levels
2. Add sound effects for:
   - Player shoot
   - Enemy shoot
   - Enemy destroyed
   - Player hit
   - Level complete
   - Game over
3. Respect settings from settings dialog
4. Use Web Audio API for better performance

TDD Approach:
- Create audio.service.spec.ts:
  * loadSound preloads audio file
  * playSound plays loaded sound
  * playSound respects volume setting
  * playMusic starts looping background track
  * stopMusic stops music playback
  * setVolume adjusts all audio levels
  * Sounds only play if volume > 0
- Mock Web Audio API
- Implement audio service
- Add sound calls at appropriate game events

Deliverable: Game with sound effects and music
```

### Prompt 7.4: Responsive Design

```
Make game responsive across different screen sizes.

Requirements:
1. Update game-canvas.component.ts to:
   - Detect screen size on init and resize
   - Scale canvas to fit available space
   - Maintain aspect ratio (4:3)
   - Scale game coordinates accordingly
   - Handle window resize events
2. Update UI components for mobile:
   - Touch controls for mobile devices
   - Responsive menu layout
   - Adjusted button sizes for touch
3. Add CSS media queries for breakpoints
4. Test on tablet and large mobile devices

TDD Approach:
- Update game-canvas.component.spec.ts:
  * Canvas scales to fit container
  * Aspect ratio maintained during resize
  * Game coordinates scaled correctly
  * Resize listener added on init
  * Resize listener removed on destroy
- Add responsive UI tests:
  * Menu readable on small screens
  * Buttons touchable on mobile
  * HUD doesn't overlap canvas
  * Dialogs fit in viewport
- Implement responsive scaling
- Test on multiple screen sizes

Deliverable: Responsive game playable on tablets
```

### Prompt 7.5: Loading States and Transitions

```
Add loading indicators and smooth transitions between game states.

Requirements:
1. Create loading.component.ts with:
   - Spinner animation using mat-progress-spinner
   - Loading message display
   - Progress bar for asset loading (if applicable)
2. Add loading states to:
   - Game initialization
   - High score loading
   - Settings loading
   - Level transitions
3. Create smooth transitions:
   - Fade between menu and game
   - Level transition animation (zoom effect)
   - Game over transition (slow-motion effect)
4. Show loading overlay during API calls

TDD Approach:
- Create loading.component.spec.ts:
  * Spinner displays during loading
  * Loading message updates correctly
  * Component hidden when not loading
- Add transition tests:
  * Loading shown during game init
  * Loading shown during API calls
  * Transitions smooth with no jarring cuts
  * Level number animates on level change
- Implement loading component
- Add loading states to all async operations
- Verify smooth user experience

Deliverable: Polished loading states and transitions
```

### Prompt 7.6: Accessibility Improvements

```
Improve accessibility for players with disabilities.

Requirements:
1. Add keyboard navigation to all menus:
   - Tab navigation between buttons
   - Enter to activate buttons
   - Escape to close dialogs
   - Focus indicators visible
2. Add ARIA labels to all interactive elements:
   - Buttons, inputs, and controls
   - Game state announcements
   - Score updates announced
3. Add high contrast mode support:
   - Configurable color schemes
   - Sufficient color contrast ratios
4. Add screen reader support:
   - Announce game events
   - Describe game state
5. Test with keyboard only (no mouse)

TDD Approach:
- Create accessibility tests:
  * All buttons have aria-labels
  * Tab order logical through UI
  * Focus visible on all elements
  * Screen reader announcements work
  * High contrast mode toggles correctly
  * Color contrast meets WCAG 2.1 AA
- Use automated accessibility testing tools
- Manual keyboard navigation testing
- Implement accessibility features

Deliverable: WCAG 2.1 Level AA compliant interface
```

## Phase 8: Testing & Documentation

### Prompt 8.1: End-to-End Test Suite

```
Create comprehensive E2E tests using Cypress.

Requirements:
1. Set up Cypress: npm install cypress --save-dev
2. Configure Cypress for Angular app
3. Create test suites in /cypress/e2e:
   - complete-gameplay.cy.ts - full game playthrough
   - menu-navigation.cy.ts - all menu interactions
   - high-score-submission.cy.ts - score submission flow
   - settings-persistence.cy.ts - settings save/load
   - error-scenarios.cy.ts - error handling
4. Test critical user journeys end-to-end
5. Include visual regression tests

TDD Approach:
- Create complete-gameplay.cy.ts:
  * Visit homepage, verify menu loads
  * Click Start Game, verify game canvas appears
  * Verify player can move left/right
  * Verify player can shoot projectiles
  * Verify enemies move and shoot back
  * Verify hitting enemy increases score
  * Verify getting hit reduces lives
  * Play until game over or level complete
  * Verify game over screen appears
- Create menu-navigation.cy.ts:
  * Navigate to each menu option
  * Open and close all dialogs
  * Verify routing works correctly
- Create high-score-submission.cy.ts:
  * Complete game with high score
  * Submit name for high score
  * Verify score appears in high scores list
- Create settings-persistence.cy.ts:
  * Change settings in dialog
  * Save settings
  * Reload page
  * Verify settings persisted
- Create error-scenarios.cy.ts:
  * Test with backend offline
  * Test with network errors
  * Verify error messages display
- Run E2E tests in CI pipeline
- Implement all E2E test scenarios

Deliverable: Complete E2E test coverage for critical flows
```

### Prompt 8.2: API Documentation with Swagger

```
Create comprehensive API documentation using Swagger/OpenAPI.

Requirements:
1. Install swagger-jsdoc and swagger-ui-express: npm install --save-dev
2. Create /src/config/swagger.config.js with OpenAPI 3.0 specification
3. Document all API endpoints with:
   - Request parameters and body schemas
   - Response schemas and status codes
   - Error responses
   - Example requests and responses
4. Add JSDoc comments to all route handlers
5. Serve Swagger UI at /api/docs endpoint
6. Include authentication/authorization details (if applicable)

TDD Approach:
- Create swagger.config.test.js:
  * Swagger config loads successfully
  * All endpoints documented
  * Schemas valid OpenAPI 3.0
- Verify documentation:
  * GET /api/docs returns Swagger UI
  * All endpoints listed in documentation
  * Request/response examples provided
  * Try-it-out functionality works
- Write JSDoc comments for each endpoint:
  * @swagger tags above each route
  * Include parameter descriptions
  * Include response schemas
- Implement Swagger integration
- Test documentation completeness

Deliverable: Complete API documentation at /api/docs
```

### Prompt 8.3: User Guide Documentation

```
Create comprehensive user guide and help documentation.

Requirements:
1. Create /docs/user-guide.md with sections:
   - Getting Started
   - Game Controls (keyboard and mouse)
   - Gameplay Mechanics
   - Scoring System
   - Enemy Types
   - Power-ups and Shields
   - Tips and Strategies
   - Troubleshooting
2. Include screenshots and diagrams
3. Write in clear, user-friendly language
4. Create FAQ section
5. Add accessibility guide

Content Structure:
- Introduction: What is Space Invaders?
- Installation: How to run the game
- Controls: Detailed control schemes
- Gameplay: How to play step-by-step
- Advanced: Strategies and tips
- Settings: How to configure game
- Troubleshooting: Common issues and solutions

Deliverable: Complete user guide in markdown format
```

### Prompt 8.4: Developer Documentation

```
Create technical documentation for developers.

Requirements:
1. Create /docs/developer-guide.md with sections:
   - Architecture Overview
   - Technology Stack
   - Project Structure
   - Setup Instructions
   - Development Workflow
   - Testing Strategy
   - API Reference
   - Deployment Guide
2. Create /docs/api-integration.md:
   - How to integrate with the API
   - Authentication (if applicable)
   - Rate limiting details
   - Error handling
   - Code examples
3. Create CONTRIBUTING.md:
   - How to contribute
   - Code style guidelines
   - Pull request process
   - Testing requirements
4. Add inline code documentation (JSDoc/TSDoc)
5. Create architecture diagrams

Content Requirements:
- Clear setup instructions
- Code examples for common tasks
- Explanation of design decisions
- How to extend the game
- Performance optimization tips

Deliverable: Complete developer documentation set
```

### Prompt 8.5: Deployment Guide

```
Create step-by-step deployment documentation.

Requirements:
1. Create /docs/deployment.md with sections:
   - Prerequisites (Node.js version, etc.)
   - Environment Configuration
   - Build Process
   - Production Deployment
   - Docker Deployment (optional)
   - Monitoring and Logging
   - Backup and Recovery
   - Scaling Considerations
2. Create deployment scripts:
   - build.sh - builds frontend and backend
   - deploy.sh - deploys to server
   - health-check.sh - verifies deployment
3. Document environment variables
4. Include troubleshooting section

Deployment Methods:
- Local production build
- VPS deployment (DigitalOcean, AWS, etc.)
- Docker container deployment
- Heroku deployment (example)
- CI/CD pipeline setup

Content Structure:
```
# Deployment Guide

## Prerequisites
- Node.js 20+ LTS
- npm 9+
- Git

## Environment Setup
1. Clone repository
2. Configure .env files
3. Install dependencies

## Build for Production
1. Frontend build: npm run build
2. Backend preparation
3. Asset optimization

## Deploy to VPS
1. Set up server
2. Configure Nginx
3. SSL certificate setup
4. PM2 process management
5. Auto-restart configuration

## Monitoring
- Log locations
- Health check endpoints
- Performance monitoring

## Backup Strategy
- Database backup (if applicable)
- High score data backup
- Configuration backup
```

Deliverable: Complete deployment documentation with scripts
```

### Prompt 8.6: Performance Benchmarking Tests

```
Create performance benchmark tests to verify requirements.

Requirements:
1. Create /tests/performance/frame-rate.test.js:
   - Measure FPS during gameplay
   - Test with maximum entities on screen
   - Verify consistent 60 FPS
   - Test on different hardware profiles
2. Create /tests/performance/load-time.test.js:
   - Measure initial page load
   - Measure asset loading time
   - Verify < 3 second load time
3. Create /tests/performance/memory.test.js:
   - Track memory usage over time
   - Play game for extended session
   - Verify no memory leaks
   - Ensure < 200MB memory usage
4. Create /tests/performance/input-latency.test.js:
   - Measure input to response time
   - Verify < 50ms latency
5. Use Performance API and Lighthouse

TDD Approach:
- Create performance test suite:
  * Run game for 5 minutes
  * Track FPS every second
  * Calculate average and minimum FPS
  * Fail if FPS < 58 (allowing 2 frame buffer)
- Memory leak detection:
  * Track heap size over 10 minutes
  * Verify memory stabilizes
  * No continuous growth pattern
- Load time testing:
  * Measure Time to Interactive (TTI)
  * Measure First Contentful Paint (FCP)
  * Verify metrics meet requirements
- Run performance tests in CI
- Generate performance reports

Deliverable: Performance test suite with benchmarks
```

### Prompt 8.7: Security Audit and Fixes

```
Perform security audit and implement fixes.

Requirements:
1. Run security audit tools:
   - npm audit for dependencies
   - OWASP ZAP for API testing
   - ESLint security plugins
2. Fix identified vulnerabilities:
   - Update vulnerable dependencies
   - Implement input sanitization
   - Add rate limiting
   - Configure CORS properly
   - Add security headers
3. Create /docs/security.md documenting:
   - Security measures implemented
   - Known limitations
   - Security best practices
   - Reporting vulnerabilities
4. Implement Content Security Policy
5. Add XSS prevention measures

Security Checklist:
- ✓ Input validation on all endpoints
- ✓ SQL injection prevention (N/A - using JSON files)
- ✓ XSS prevention (sanitize user input)
- ✓ CSRF protection (if needed)
- ✓ Rate limiting on API endpoints
- ✓ Secure headers (Helmet.js)
- ✓ CORS configured correctly
- ✓ Dependencies up to date
- ✓ No secrets in code
- ✓ HTTPS in production

Implementation Steps:
1. Install helmet: npm install helmet
2. Add helmet middleware to Express
3. Configure CSP headers
4. Implement rate limiting with express-rate-limit
5. Sanitize all user inputs (player names, scores)
6. Validate all API inputs
7. Run security audit tools
8. Fix all high/critical vulnerabilities

Deliverable: Secure application with audit report
```

### Prompt 8.8: Code Coverage Report

```
Generate and verify code coverage meets requirements.

Requirements:
1. Configure code coverage tools:
   - Jest coverage for backend
   - Karma coverage for Angular frontend
   - Generate HTML reports
2. Set coverage thresholds in jest.config.js:
   - Statements: 80%
   - Branches: 75%
   - Functions: 80%
   - Lines: 80%
3. Create coverage report for:
   - Unit tests
   - Integration tests
   - Combined coverage
4. Identify uncovered code paths
5. Write tests for uncovered areas
6. Add coverage badge to README

Configuration:
```javascript
// jest.config.js
module.exports = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'text', 'lcov'],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 75,
      functions: 80,
      lines: 80
    }
  }
};
```

Tasks:
1. Run coverage: npm run test:coverage
2. Review HTML report in /coverage
3. Identify files below threshold
4. Write additional tests for uncovered code
5. Focus on critical paths first
6. Re-run until thresholds met
7. Add coverage to CI pipeline
8. Generate coverage badge

Deliverable: 80%+ code coverage with report
```

### Prompt 8.9: Final Integration Testing

```
Perform final integration testing before release.

Requirements:
1. Create comprehensive integration test checklist
2. Test all user flows end-to-end:
   - New player experience
   - Returning player experience
   - High score submission
   - Settings changes
   - All menu interactions
3. Cross-browser testing:
   - Chrome (latest)
   - Firefox (latest)
   - Safari (15+)
   - Edge (latest)
4. Device testing:
   - Desktop (1920×1080, 1366×768)
   - Tablet (iPad, Android tablet)
   - Large mobile (optional)
5. API integration testing:
   - All endpoints working
   - Error handling correct
   - Data persistence verified
6. Performance testing under load

Test Scenarios:
1. Fresh Installation:
   - First time user
   - No data exists
   - Default settings applied
   - Game plays correctly

2. Returning Player:
   - Settings persist
   - High scores saved
   - Resume gameplay

3. Edge Cases:
   - Backend offline
   - Slow network
   - Large high score list
   - Maximum score reached
   - All enemies destroyed
   - All lives lost

4. Data Integrity:
   - Scores save correctly
   - No data corruption
   - Backup/restore works
   - Concurrent access handled

Create test report documenting:
- Test scenarios executed
- Pass/fail status
- Issues found
- Issues resolved
- Performance metrics
- Browser compatibility matrix

Deliverable: Complete integration test report
```

### Prompt 8.10: README and Final Documentation

```
Create comprehensive README and finalize all documentation.

Requirements:
1. Create README.md with sections:
   - Project Title and Description
   - Screenshots/Demo GIF
   - Features List
   - Technology Stack
   - Installation Instructions
   - Quick Start Guide
   - Development Setup
   - Testing Instructions
   - Deployment Guide
   - Contributing Guidelines
   - License
   - Credits and Acknowledgments
2. Create CHANGELOG.md:
   - Version history
   - Feature additions
   - Bug fixes
   - Breaking changes
3. Create LICENSE file (choose appropriate license)
4. Update package.json with:
   - Correct project name and description
   - Author information
   - Repository URL
   - Keywords for discoverability
5. Create .github folder with:
   - Issue templates
   - Pull request template
   - GitHub Actions workflows (if using)

README Template:
```markdown
# Space Invaders - Modern Web Implementation

[![Build Status](badge-url)](link)
[![Coverage](badge-url)](link)
[![License](badge-url)](link)

A modern, full-stack implementation of the classic Space Invaders arcade game built with Angular and Node.js.

## 🎮 Features

- ✨ Smooth 60 FPS gameplay
- 🎯 Dual control scheme (keyboard and mouse)
- 🏆 Persistent high scores
- ⚙️ Customizable settings
- 📱 Responsive design
- 🎨 Material Design UI
- 🔊 Sound effects and music
- ♿ Accessibility features

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ LTS
- npm 9+

### Installation
```bash
# Clone the repository
git clone [repository-url]

# Install backend dependencies
cd space-invaders-server
npm install

# Install frontend dependencies
cd ../space-invaders-client
npm install
```

### Running the Game
```bash
# Start backend server
cd space-invaders-server
npm run dev

# Start frontend (in new terminal)
cd space-invaders-client
npm start

# Open browser to http://localhost:4200
```

## 🎯 How to Play

[Controls and gameplay instructions]

## 🛠️ Development

[Development setup and guidelines]

## 🧪 Testing

[Testing instructions]

## 📦 Deployment

[Deployment instructions]

## 🤝 Contributing

[Contributing guidelines]

## 📄 License

[License information]

## 👏 Credits

[Acknowledgments and credits]
```

Deliverable: Complete project documentation package
```

## Phase 9: Additional Features (Optional Enhancements)

### Prompt 9.1: Power-Up System

```
Add power-up system with collectible bonuses (optional enhancement).

Requirements:
1. Create /src/app/core/services/powerup.service.ts with:
   - createPowerUp(type, x, y): PowerUp - creates power-up entity
   - updatePowerUps(powerups[], deltaTime): PowerUp[] - moves power-ups
   - applyPowerUp(player, type): Player - applies effect
2. Power-up types:
   - RAPID_FIRE: Increases fire rate for 10 seconds
   - SHIELD: Adds temporary shield
   - MULTI_SHOT: Shoots 3 projectiles at once
   - EXTRA_LIFE: Adds one life
3. Power-ups drop randomly from destroyed enemies (5% chance)
4. Power-ups fall downward slowly
5. Collect by touching with player ship

TDD Approach:
- Create powerup.service.spec.ts:
  * createPowerUp generates power-up at position
  * updatePowerUps moves power-ups downward
  * Power-ups removed when off-screen
  * applyPowerUp applies correct effect
  * RAPID_FIRE reduces fire cooldown
  * SHIELD adds temporary invincibility
  * MULTI_SHOT changes shooting pattern
  * EXTRA_LIFE increases lives by 1
  * Power-up effects expire after duration
- Implement power-up system
- Add visual indicators for active power-ups
- Test power-up collection and effects

Deliverable: Power-up system with multiple types
```

### Prompt 9.2: Leaderboard with Multiplayer Comparison

```
Add global leaderboard with player rankings (optional enhancement).

Requirements:
1. Enhance high score system to include:
   - Global rankings (all players)
   - Daily/weekly/all-time boards
   - Player profiles with stats
   - Compare with friends
2. Create /src/app/features/leaderboard component:
   - Multiple leaderboard tabs
   - Filter by time period
   - Search for specific players
   - Visual rank indicators (medals, badges)
3. Backend enhancements:
   - Aggregate statistics
   - Rank calculation
   - Percentile ranking
4. Display player's global rank in HUD

TDD Approach:
- Create leaderboard tests:
  * Leaderboard loads all-time top scores
  * Filter switches between time periods
  * Search finds players by name
  * Player's rank calculated correctly
  * Rank updates when new scores submitted
  * Percentile displayed (top 10%, etc.)
- Implement leaderboard component
- Add backend ranking algorithms
- Test with large datasets

Deliverable: Multi-period leaderboard system
```

### Prompt 9.3: Achievement System

```
Add achievement/trophy system with unlockables (optional enhancement).

Requirements:
1. Create /src/app/core/services/achievement.service.ts with:
   - defineAchievements(): Achievement[] - creates achievement list
   - checkAchievement(id, gameState): boolean - checks if unlocked
   - unlockAchievement(playerId, id): void - unlocks achievement
   - getPlayerAchievements(playerId): Achievement[] - retrieves unlocked
2. Achievement types:
   - Score milestones (10K, 50K, 100K points)
   - Accuracy achievements (90%+ hit rate)
   - Survival achievements (no hits for full level)
   - Speed achievements (complete level in under 2 mins)
   - Combo achievements (10+ combo)
3. Display achievements in player profile
4. Show notification when achievement unlocked
5. Track progress toward achievements

TDD Approach:
- Create achievement.service.spec.ts:
  * defineAchievements returns all achievements
  * checkAchievement detects when conditions met
  * unlockAchievement persists to backend
  * getPlayerAchievements retrieves correct list
  * Achievement progress tracked correctly
  * Notifications trigger on unlock
  * Duplicate unlocks prevented
- Implement achievement system
- Create achievement UI component
- Add backend persistence

Deliverable: Achievement system with tracking
```

### Prompt 9.4: Game Replays

```
Add replay system to record and playback games (optional enhancement).

Requirements:
1. Create /src/app/core/services/replay.service.ts with:
   - startRecording(): void - begins recording inputs
   - recordInput(input, timestamp): void - saves input event
   - stopRecording(): Replay - finishes and returns replay data
   - playReplay(replay): void - plays back recorded game
   - saveReplay(replay, name): void - saves to backend
   - loadReplay(id): Replay - loads saved replay
2. Record game inputs and timestamps
3. Replay engine recreates gameplay exactly
4. Save replays of high scores automatically
5. Share replays with other players

TDD Approach:
- Create replay.service.spec.ts:
  * startRecording initializes replay buffer
  * recordInput saves input with timestamp
  * stopRecording returns complete replay data
  * playReplay recreates game state accurately
  * Replay matches original gameplay exactly
  * saveReplay persists to backend
  * loadReplay retrieves saved replay
- Implement deterministic replay system
- Test with various game scenarios
- Verify replay accuracy

Deliverable: Game replay recording and playback
```

### Prompt 9.5: Mobile Touch Controls

```
Add mobile-specific touch controls (optional enhancement).

Requirements:
1. Create /src/app/core/services/touch-handler.service.ts with:
   - enableTouch(element): void - registers touch listeners
   - getTouchPosition(): {x, y} - returns touch coordinates
   - onTap(): Observable<void> - tap event stream
   - onSwipe(): Observable<SwipeDirection> - swipe detection
2. Mobile control scheme:
   - Touch left half of screen: move left
   - Touch right half of screen: move right
   - Tap to shoot
   - Swipe up for rapid fire
3. Visual touch indicators
4. Virtual D-pad option
5. Auto-detect mobile device

TDD Approach:
- Create touch-handler.service.spec.ts:
  * enableTouch registers touch event listeners
  * getTouchPosition returns correct coordinates
  * onTap emits when screen tapped
  * onSwipe detects swipe direction
  * Left side touch moves player left
  * Right side touch moves player right
  * Tap fires projectile
- Implement touch control system
- Test on actual mobile devices
- Ensure responsive and precise

Deliverable: Mobile touch control system
```

## Summary of Implementation Approach

This comprehensive prompt set provides **75 discrete prompts** organized into **9 phases** that build a complete Space Invaders game using TDD methodology. Each prompt:

1. **Stands alone** - Contains all necessary context
2. **Follows TDD** - Write tests first, then implement
3. **Builds incrementally** - Each step adds to previous work
4. **Includes testing** - Comprehensive test coverage at every stage
5. **Integrates immediately** - No orphaned or hanging code

## Key Principles Applied

- ✅ **Small, safe steps** - Each prompt is focused and manageable
- ✅ **Test-driven** - Red-Green-Refactor cycle at every stage
- ✅ **Incremental progress** - Playable game emerges gradually
- ✅ **No big jumps** - Complexity increases smoothly
- ✅ **Full integration** - Everything wired together continuously
- ✅ **Best practices** - Clean code, SOLID principles, design patterns
- ✅ **Production ready** - Includes deployment, documentation, security

## Usage Instructions

1. Execute prompts sequentially within each phase
2. Complete all tests before moving to next prompt
3. Verify integration after each implementation
4. Run full test suite before moving to next phase
5. Review and refactor after completing each phase

## Estimated Timeline

- Phase 1: ~1 week (Project setup and infrastructure)
- Phase 2: ~1 week (Core game engine)
- Phase 3: ~1 week (Enemy system)
- Phase 4: ~1 week (Game features)
- Phase 5: ~1 week (UI/UX)
- Phase 6: ~1 week (Backend integration)
- Phase 7: ~1 week (Polish and optimization)
- Phase 8: ~1 week (Testing and documentation)
- Phase 9: ~1-2 weeks (Optional enhancements)

**Total: 8-10 weeks for complete implementation**

This systematic approach ensures a robust, well-tested, production-quality Space Invaders implementation.