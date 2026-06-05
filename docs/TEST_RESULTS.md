# Test Results

## Backend (Jest + Supertest)

Run: `npm test`  
Run with coverage: `npm test -- --coverage`

### Summary

```
Test Suites: 6 passed, 6 total
Tests:       77 passed, 77 total
```

### Breakdown

| Suite | File | Tests |
|-------|------|-------|
| Server health | `tests/integration/server.test.js` | 1 |
| Config API | `tests/integration/config.routes.test.js` | 11 |
| High Score API | `tests/integration/highscore.routes.test.js` | 18 |
| FileStorageService | `tests/unit/services/file-storage.service.test.js` | 14 |
| ConfigService | `tests/unit/services/config.service.test.js` | 16 |
| HighScoreService | `tests/unit/services/highscore.service.test.js` | 17 |

### Coverage

| Service | Statements | Branches | Functions | Lines |
|---------|-----------|----------|-----------|-------|
| `file-storage.service.js` | 100% | 100% | 100% | 100% |
| `config.service.js` | 97.67% | 92.86% | 100% | 97.56% |
| `highscore.service.js` | 97.22% | 90% | 100% | 97.06% |
| **Overall** | **~88%+** | — | — | — |

---

## Frontend (Karma + Jasmine)

Run: `cd space-invaders-client && npm test`  
Run with coverage: `cd space-invaders-client && npm run test:coverage`

### Summary

```
Tests: 188 passed, 188 total
Test Suites: 20 service specs
```

### Service Specs

| Service | File |
|---------|------|
| ApiService | `api.service.spec.ts` |
| CanvasService | `canvas.service.spec.ts` |
| CollisionService | `collision.service.spec.ts` |
| ConfigService | `config.service.spec.ts` |
| EnemyMovementService | `enemy-movement.service.spec.ts` |
| EnemyService | `enemy.service.spec.ts` |
| EnemyShootingService | `enemy-shooting.service.spec.ts` |
| ErrorHandlerService | `error-handler.service.spec.ts` |
| GameLoopService | `game-loop.service.spec.ts` |
| GameStateService | `game-state.service.spec.ts` |
| HighscoreService | `highscore.service.spec.ts` |
| InputHandlerService | `input-handler.service.spec.ts` |
| LevelService | `level.service.spec.ts` |
| MysteryShipService | `mystery-ship.service.spec.ts` |
| PlayerService | `player.service.spec.ts` |
| ProjectileService | `projectile.service.spec.ts` |
| ScoreService | `score.service.spec.ts` |
| SettingsService | `settings.service.spec.ts` |
| ShieldService | `shield.service.spec.ts` |
| WebsocketService | `websocket.service.spec.ts` |

---

## Running Specific Suites

```bash
# Backend — single suite
npm test -- tests/unit/services/config.service.test.js

# Backend — integration only
npm test -- tests/integration/

# Frontend — single spec
cd space-invaders-client
npx karma start karma.conf.js --include src/app/core/services/player.service.spec.ts
```
