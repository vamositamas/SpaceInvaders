# Space Invaders

A full-stack implementation of the classic Space Invaders arcade game — Angular 20 frontend with an HTML5 Canvas game engine, backed by a Node.js/Express REST API.

---

## Overview

| Layer | Technology | Port |
|---|---|---|
| Frontend | Angular 20 (zoneless, SSR) | 4200 |
| Backend | Node.js + Express | 3000 |

---

## Quick Start

### Prerequisites
- Node.js 20+
- npm 10+

### 1. Install dependencies

```bash
# Backend
npm install

# Frontend
cd space-invaders-client && npm install
```

### 2. Start both servers

```bash
# From the workspace root — starts backend (port 3000) + frontend (port 4200)
# Use the VS Code task: "Start All Servers"
# Or manually:

# Terminal 1 – Backend
npm run dev

# Terminal 2 – Frontend
cd space-invaders-client && npm start
```

### 3. Open the game

Navigate to **http://localhost:4200**

---

## Gameplay

- **Move:** Arrow keys / A & D / Mouse
- **Shoot:** Spacebar / Left mouse button
- **Pause:** P key
- **Rapid Fire:** Toggle the ⚡ RAPID FIRE button in the HUD (4× fire rate)

---

## Project Structure

```
├── server.js                        # Express entry point
├── src/                             # Backend source
│   ├── controllers/                 # Route controllers
│   ├── services/                    # Business logic (config, highscore, file storage)
│   ├── routes/                      # API route definitions
│   ├── middleware/                  # Validation middleware
│   ├── models/                      # Data schemas
│   └── websocket/                   # Socket.io handlers (reserved)
├── data/
│   ├── config/
│   │   ├── game-config.json         # Active game configuration
│   │   └── default-config.json      # Default/reset values
│   ├── highscores/
│   │   └── highscores.json          # Persisted high scores
│   └── settings/
│       └── settings.json            # Player settings
├── tests/
│   ├── unit/                        # Jest unit tests (backend)
│   └── integration/                 # Supertest integration tests
├── space-invaders-client/           # Angular frontend
│   └── src/app/
│       ├── core/
│       │   ├── models/              # TypeScript interfaces
│       │   └── services/            # All game + API services
│       └── features/
│           ├── menu/                # Main menu, settings, high scores
│           ├── game/                # Game canvas, HUD, pause overlay
│           └── game-over/           # Game over screen
└── docs/                            # Documentation
    ├── ai documents/                # AI-generated implementation summaries
    └── prompts/                     # Development phase prompts
```

---

## Frontend Architecture

Built with Angular 20 using **zoneless change detection** — all reactive state uses Angular `signal()`s or RxJS.

### Services (core/services)

| Service | Responsibility |
|---|---|
| `GameStateService` | Score, lives, level, pause, game-over, rapid fire state |
| `PlayerService` | Player position, movement, invincibility, fire-rate cooldown |
| `EnemyService` | Enemy grid initialisation and queries |
| `EnemyMovementService` | Formation movement, edge bouncing, speed scaling |
| `EnemyShootingService` | Random enemy fire with configurable rate |
| `ProjectileService` | Player & enemy projectile pools |
| `CollisionService` | AABB collision detection |
| `ShieldService` | Shield entity management and damage |
| `MysteryShipService` | Mystery ship spawning and scoring |
| `ScoreService` | Score calculation and combo tracking |
| `LevelService` | Level progression and per-level config |
| `CanvasService` | Canvas init and draw context |
| `InputHandlerService` | Keyboard and mouse input |
| `ConfigService` | Reactive game config (from backend API) |
| `SettingsService` | Player settings (from backend API) |
| `HighscoreService` | High score fetching and submission |
| `ApiService` | HTTP client for all backend endpoints |
| `WebsocketService` | Socket.io client (reserved) |

### Game Features

- **Frame-independent movement** — all logic uses `deltaTime`
- **Rapid Fire toggle** — HUD button, 4× fire rate, yellow glow animation
- **Invincibility frames** — 2s after taking damage
- **Speed scaling** — enemies accelerate as they are destroyed (2 px/s per kill)
- **Level progression** — new grid + shields on each level complete
- **Mystery ship** — bonus points, random spawn interval
- **Pause / resume** — P key or pause overlay button

---

## Backend API

```
GET  /health                    Server health check
GET  /api/config                Get active game configuration
PUT  /api/config                Update configuration
POST /api/config/reset          Reset to defaults
GET  /api/highscores?limit=10   Get top scores
POST /api/highscores            Submit a new high score
GET  /api/highscores/:id        Get score by ID
DELETE /api/highscores/:id      Delete a score
GET  /api/settings              Get player settings
PUT  /api/settings              Save player settings
POST /api/settings/reset        Reset settings to defaults
```

---

## Game Configuration

Stored in `data/config/game-config.json`:

```json
{
  "canvas": { "width": 800, "height": 650 },
  "player": { "speed": 5, "fireRate": 500, "lives": 3 },
  "enemies": {
    "rows": 5, "columns": 11,
    "baseSpeed": 1, "speedIncrement": 0.1, "fireRate": 2000
  },
  "difficulty": {
    "easy":   { "speedMultiplier": 0.75, "fireRateMultiplier": 1.5 },
    "normal": { "speedMultiplier": 1.0,  "fireRateMultiplier": 1.0 },
    "hard":   { "speedMultiplier": 1.5,  "fireRateMultiplier": 0.5 }
  }
}
```

---

## Testing

### Backend (Jest + Supertest)

```bash
npm test
npm test -- --coverage
```

**Results:** 77 tests passing across 6 suites
- Integration: Config API (11), High Score API (18), Server (1)
- Unit: FileStorageService (14), ConfigService (16), HighScoreService (17)

### Frontend (Karma + Jasmine)

```bash
cd space-invaders-client
npm test
npm run test:coverage
```

**Results:** 188 tests passing — 20 services fully covered

---

## Available Scripts

### Backend
| Script | Description |
|---|---|
| `npm start` | Production server |
| `npm run dev` | Dev server with nodemon auto-reload |
| `npm test` | Run Jest test suite |

### Frontend
| Script | Description |
|---|---|
| `npm start` | Angular dev server (port 4200) |
| `npm run build` | Production build |
| `npm test` | Karma unit tests |
| `npm run lint` | ESLint |

### VS Code Tasks
- **Start All Servers** — starts backend + frontend in parallel
- **Stop All Servers** — kills both servers
- **Restart Backend / Frontend**

---

## Tech Stack

**Frontend:**
- Angular 20 (standalone components, zoneless, SSR)
- Angular Material
- RxJS
- TypeScript (strict mode)
- HTML5 Canvas

**Backend:**
- Node.js + Express 4
- Jest + Supertest
- Nodemon
- dotenv, Helmet, express-rate-limit

---

## Environment

Backend `.env`:
```env
NODE_ENV=development
PORT=3000
ALLOWED_ORIGINS=http://localhost:4200
```

---

## License

ISC

## Features

- ✅ **RESTful API** - Full CRUD operations for game configuration and high scores
- ✅ **High Score System** - Persistent high score tracking (top 100) with REST API
- ✅ **Configuration Management** - Dynamic game settings with validation
- ✅ **File-Based Storage** - JSON file persistence for data
- ✅ **Comprehensive Testing** - 77 tests with excellent coverage
- ✅ **Error Handling** - Robust validation and error responses
- ✅ **CORS Enabled** - Ready for frontend integration

## Project Structure

```
├── server.js                    # Main Express server
├── src/
│   ├── controllers/             # Route controllers
│   │   ├── config.controller.js
│   │   └── highscore.controller.js
│   ├── services/                # Business logic
│   │   ├── file-storage.service.js
│   │   ├── config.service.js
│   │   └── highscore.service.js
│   ├── routes/                  # API routes
│   │   ├── config.routes.js
│   │   └── highscore.routes.js
│   ├── middleware/              # Custom middleware
│   │   └── validation.js
│   ├── models/                  # Data models & validation
│   │   └── schemas.js
│   ├── utils/                   # Utility functions
│   └── websocket/               # Socket.io handlers (future)
├── data/
│   ├── highscores/              # High scores storage
│   │   └── highscores.json
│   ├── settings/                # Game settings
│   └── config/                  # Configuration files
│       ├── default-config.json
│       └── game-config.json
├── tests/
│   ├── unit/                    # Unit tests (47 tests)
│   │   └── services/
│   └── integration/             # Integration tests (30 tests)
│       ├── server.test.js
│       ├── config.routes.test.js
│       └── highscore.routes.test.js
├── docs/                        # Documentation
│   ├── CONFIG_API.md
│   ├── CONFIG_SERVICE.md
│   ├── FILE_STORAGE_SERVICE.md
│   ├── HIGHSCORE_SERVICE.md
│   ├── HIGHSCORE_API.md
│   └── TEST_RESULTS.md
├── .env                         # Environment variables
├── .eslintrc.json              # ESLint configuration
├── .prettierrc                 # Prettier configuration
└── package.json                # Project dependencies

```

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   The `.env` file contains:
   ```env
   NODE_ENV=development
   PORT=3000
   ALLOWED_ORIGINS=http://localhost:4200
   ```

3. **Start the server:**
   ```bash
   npm run dev
   ```

4. **Test the API:**
   ```bash
   curl http://localhost:3000/health
   curl http://localhost:3000/api/config
   ```

## Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon (auto-reload)
- `npm test` - Run the complete test suite with Jest
- `npm test -- --coverage` - Run tests with coverage report

## API Endpoints

### Health Check
- **GET** `/health`
  - Returns server health status
  - Response: `{ "status": "OK" }`

### Configuration Management
- **GET** `/api/config` - Get current configuration
- **PUT** `/api/config` - Update configuration
- **POST** `/api/config/reset` - Reset to defaults

See [CONFIG_API.md](docs/CONFIG_API.md) for complete API documentation.

### High Score Management
- **GET** `/api/highscores?limit=10` - Get top scores with optional limit
- **POST** `/api/highscores` - Submit a new high score
- **GET** `/api/highscores/:id` - Get specific score by ID
- **DELETE** `/api/highscores/:id` - Delete a score

See [HIGHSCORE_API.md](docs/HIGHSCORE_API.md) for complete API documentation.

## Services

### FileStorageService
Handles JSON file operations with automatic directory creation and backup support.
- Read/write JSON files
- Auto-create directories
- File backup functionality
- **Coverage:** 100%

[Documentation](docs/FILE_STORAGE_SERVICE.md)

### ConfigService
Manages game configuration with validation and persistence.
- Load/save configuration
- Partial updates with deep merge
- Default fallback
- **Coverage:** 97.67%

[Documentation](docs/CONFIG_SERVICE.md)

### HighScoreService
Persistent high score tracking with automatic sorting and validation.
- Top 100 score management
- Automatic sorting
- Score qualification checking
- **Coverage:** 97.22%

[Documentation](docs/HIGHSCORE_SERVICE.md)

## Testing

This project follows Test-Driven Development (TDD) practices with comprehensive test coverage.

**Run all tests:**
```bash
npm test
```

**Run specific test suite:**
```bash
npm test -- tests/unit/services/config.service.test.js
```

**Run with coverage:**
```bash
npm test -- --coverage
```

**Test Results:**
```
Test Suites: 6 passed, 6 total
Tests:       77 passed, 77 total

Coverage Summary:
- Services: 98%+ coverage
- Overall: 88%+ coverage
```

### Test Structure
- **Integration Tests** (30 tests) - API endpoints, server health
  - Server health: 1 test
  - Config API: 11 tests
  - High Score API: 18 tests
- **Unit Tests** (47 tests) - Service layer logic
  - FileStorageService: 14 tests
  - ConfigService: 16 tests
  - HighScoreService: 17 tests

## Development

### Tech Stack

**Runtime & Framework:**
- Node.js
- Express 4.x - Web framework
- CORS - Cross-Origin Resource Sharing
- dotenv - Environment variable management

**Development Tools:**
- Jest - Testing framework
- Supertest - HTTP assertions
- ESLint - Code linting
- Prettier - Code formatting
- Nodemon - Auto-restart during development

**Future:**
- Socket.io 4.x - Real-time communication (planned)

### Code Quality

- **ESLint** - Enforces code style and best practices
- **Prettier** - Consistent code formatting
- **Jest** - 59 passing tests with excellent coverage
- **TDD Approach** - All features developed test-first

## Configuration

### Default Game Configuration

```json
{
  "canvas": { "width": 800, "height": 600 },
  "player": { "speed": 5, "fireRate": 500, "lives": 3 },
  "enemies": {
    "rows": 5,
    "columns": 11,
    "baseSpeed": 1,
    "speedIncrement": 0.1,
    "fireRate": 2000
  },
  "difficulty": {
    "easy": { "speedMultiplier": 0.75, "fireRateMultiplier": 1.5 },
    "normal": { "speedMultiplier": 1.0, "fireRateMultiplier": 1.0 },
    "hard": { "speedMultiplier": 1.5, "fireRateMultiplier": 0.5 }
  }
}
```

## Error Handling

The API includes comprehensive error handling:
- **400 Bad Request** - Validation errors
- **404 Not Found** - Unknown routes
- **500 Internal Server Error** - Unexpected errors

All errors return JSON with descriptive messages:
```json
{
  "error": "Player lives must be a positive integer"
}
```

## CORS Configuration

CORS is enabled for the frontend origin specified in `.env`:
```env
ALLOWED_ORIGINS=http://localhost:4200
```

## Documentation

Complete documentation available in the `/docs` folder:
- [Config API Documentation](docs/CONFIG_API.md) - REST API reference
- [Config Service](docs/CONFIG_SERVICE.md) - Configuration management
- [File Storage Service](docs/FILE_STORAGE_SERVICE.md) - JSON file operations
- [High Score Service](docs/HIGHSCORE_SERVICE.md) - Score persistence

## Future Enhancements

- [ ] Socket.io integration for real-time multiplayer
- [ ] High score API endpoints
- [ ] Game session management
- [ ] Player authentication
- [ ] Leaderboard API
- [ ] Rate limiting
- [ ] API versioning
- [ ] WebSocket events for live updates

## License

ISC
