# Space Invaders

A modern full-stack recreation of the classic **Space Invaders** arcade game, featuring a sleek, cyber-retro dark neon styling. Powered by an **Angular 20** (zoneless, SSR) frontend utilizing an HTML5 Canvas game engine and a custom sound synthesizer, backed by a production-ready **Node.js/Express** REST API.

---

## 🎮 Features & Architecture

### 📺 Frontend Design & Visuals
*   **Neon Cyber Theme:** Complete visual redesign of the main menu, settings, instructions, HUD, and game-over screens with modern glassmorphism, vibrant neon gradients, and active glowing outlines.
*   **Space CRT Scanline Effect:** Simulated retro scanlines overlaying the container to replicate the look of a classic physical arcade cabinet.
*   **Responsive Layout:** Fully styled, responsive game cards centered within the viewport.
*   **Interactive Controls:** Smooth animations on hover and active states for arcade-style button elements.

### 🚀 Canvas Sprite Engine
*   **TDD-based Pixel Art Engine:** Draws entities based on raw byte matrices representing pixel-art characters.
*   **Animated Entities:** Active frame-swapping animations for enemy types:
    *   *Squid* (Top Row)
    *   *Crab* (Middle Rows)
    *   *Octopus* (Bottom Rows)
    *   *UFO* (Bonus Mystery Ship)
*   **Vector Particle System (`ParticleService`):** Spawns real-time canvas particle effects when laser beams strike shield bunkers, aliens, or the player ship, utilizing velocity vectors for dynamic debris dispersal.
*   **Web Audio API Sound Synthesizer (`AudioService`):** Custom synthesizer that dynamically constructs audio frequencies in real-time. Avoids heavy external audio file requests, generating pure retro synth-wave effects for lasers, alien steps, UFO hums, and explosions.
*   **Deterministic Shield Erosion:** When projectiles impact the green shield bunkers, they carve out circular chunks directly from the shield's visual matrix coordinate map based on damage health, ensuring authentic retro destruction.
*   **Dynamic Neon Glows:** Uses canvas `shadowBlur` to cast a vibrant green/purple neon glow around lasers and explosions.
*   **Zoneless Change Detection:** Uses Angular signals and RxJS streams for high-performance frontend state management.

### 🔒 Backend Security & Production Settings
*   **Helmet Middleware:** Integrates Express `helmet` to set secure HTTP response headers, mitigating threats like Cross-Site Scripting (XSS), Clickjacking, and MIME sniffing.
*   **API Rate Limiting (`express-rate-limit`):** Configured rate limiter protecting `/api/` endpoints by restricting any single IP address to a maximum of **100 requests per 15-minute window**.
*   **CORS Configuration:** Restricts cross-origin resource sharing to designated origins specified via environment variables.
*   **Interactive Swagger Documentation:** Self-documenting REST API with a built-in interactive Swagger interface served at `http://localhost:3000/api/docs`.

---

## 📂 Project Structure

```
├── server.js                        # Express entry point
├── src/                             # Backend source code
│   ├── controllers/                 # Route controllers (Config, Highscores, Settings)
│   ├── services/                    # Business logic (File storage, High scores, Config)
│   ├── routes/                      # API endpoint routing
│   ├── middleware/                  # Request schema validation & error handlers
│   ├── models/                      # Validation schemas and data models
│   ├── utils/                       # Swagger configuration and helpers
│   └── websocket/                   # Real-time Socket.io workspace (future-proofing)
├── data/                            # File-based database persistence
│   ├── config/                      # Active game configuration & default fallbacks
│   ├── highscores/                  # Persisted high scores json data
│   └── settings/                    # Saved player settings
├── tests/                           # Backend Test Suite
│   ├── unit/                        # Jest unit tests for backend services
│   └── integration/                 # Supertest endpoint integration tests
├── space-invaders-client/           # Angular Frontend Workspace
│   ├── src/app/
│   │   ├── core/                    # Core modules & stateful services
│   │   │   ├── models/              # TypeScript types & interfaces
│   │   │   └── services/            # Game and API logic services (Audio, Particles, Canvas)
│   │   └── features/                # Presentational components & overlays
│   │       ├── menu/                # Main Menu, Settings, Instructions, High Scores
│   │       ├── game/                # Game Board canvas, HUD, Pause dialog
│   │       └── game-over/           # Game Over and Name entry screen
│   └── e2e/                         # Playwright End-to-End browser tests
└── docs/                            # Technical Documentation and APIs
```

---

## ⚡ Quick Start

### Prerequisites
*   **Node.js 20+**
*   **npm 10+**

### 1. Install Dependencies
Install dependencies for both the backend (root) and frontend workspace:

```bash
# Root (Backend)
npm install

# Client (Frontend)
cd space-invaders-client && npm install
```

### 2. Configure Environment
Create a `.env` file in the root directory:
```env
NODE_ENV=development
PORT=3000
ALLOWED_ORIGINS=http://localhost:4200
```

### 3. Running the Servers
Start the backend and frontend development servers.

```bash
# Terminal 1 - Start Express Backend (Port 3000)
npm run dev

# Terminal 2 - Start Angular Frontend (Port 4200)
cd space-invaders-client && npm start
```

Navigate to **[http://localhost:4200](http://localhost:4200)** to play the game!  
Visit the interactive API documentation at **[http://localhost:3000/api/docs](http://localhost:3000/api/docs)**.

---

## 🎮 Gameplay Controls

*   **Move Left/Right:** `A` / `D`, `Left` / `Right` Arrow keys, or Mouse horizontal movement.
*   **Fire Laser:** `Spacebar` or Left mouse click.
*   **Pause Game:** `P` key (toggles the pause dialog overlay).
*   **Rapid Fire Mod:** Toggle the ⚡ **RAPID FIRE** button in the HUD (increases laser fire-rate by 4× with a glowing yellow state).

---

## 🌐 API Reference

| Method | Endpoint | Description |
|---|---|---|
| **GET** | `/health` | Server health check (returns `{ "status": "OK" }`) |
| **GET** | `/api/config` | Retrieves the active game configuration |
| **PUT** | `/api/config` | Modifies active game configurations |
| **POST** | `/api/config/reset` | Resets game configurations back to defaults |
| **GET** | `/api/highscores` | Fetches saved high scores (supports pagination & sorting) |
| **POST** | `/api/highscores` | Submits a new score entry to the scoreboard |
| **DELETE**| `/api/highscores/:id` | Removes a high score entry by identifier |
| **GET** | `/api/settings` | Gets active player settings (volume, sound, difficulty) |
| **PUT** | `/api/settings` | Saves player settings |
| **POST** | `/api/settings/reset` | Resets settings to defaults |

---

## 🧪 Testing Suites

All testing frameworks are configured to run headlessly.

### 1. Backend Integration & Unit Tests (Jest + Supertest)
Runs comprehensive unit testing of service layers and mock integrations of REST controllers.
```bash
# Run all backend tests
npm test

# Run with coverage report
npm test -- --coverage
```
*   **Result:** **188 passed** Jest unit & integration tests.

### 2. Frontend Unit Tests (Karma + Jasmine)
Validates individual services, custom canvas logic, audio nodes, particle vector states, and component bindings.
```bash
cd space-invaders-client
npm test -- --watch=false --browsers=ChromeHeadless
```
*   **Result:** **620 passed** Karma specs.

### 3. End-to-End Tests (Playwright)
Executes cross-browser browser routines to verify visual rendering, menu traversal, active gameplay loops, scoring overlays, and API mock-intercept checks.
```bash
cd space-invaders-client
npx playwright test
```
*   **Result:** **3 passed** scenario flows.

---

## 📝 License
ISC
