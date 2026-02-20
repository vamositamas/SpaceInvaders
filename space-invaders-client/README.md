# Space Invaders — Angular Frontend

Angular 20 frontend for the Space Invaders game. Renders the game on an HTML5 Canvas and communicates with the Express backend via REST API.

## Requirements

- Node.js 20+
- Backend server running on port 3000 (see root `README.md`)

## Quick Start

```bash
npm install
npm start
```

Open **http://localhost:4200**

## Scripts

| Command | Description |
|---|---|
| `npm start` | Dev server with hot-reload (port 4200) |
| `npm run build` | Production build → `dist/` |
| `npm test` | Unit tests via Karma/Jasmine |
| `npm run test:coverage` | Tests with coverage report |
| `npm run lint` | ESLint |

## Architecture

- **Standalone components** with Angular Material UI
- **Zoneless change detection** — state managed with `signal()` and RxJS
- **SSR enabled** via Angular Universal
- **Proxy** — `/api` requests forwarded to `http://localhost:3000` (see `proxy.conf.json`)

## Key Directories

```
src/app/
├── core/
│   ├── models/        # TypeScript interfaces (GameConfig, HighScore, etc.)
│   └── services/      # All game logic and API services
└── features/
    ├── menu/          # Main menu, settings dialog, instructions, high scores
    ├── game/          # Game canvas, HUD, pause overlay, game board
    └── game-over/     # Game over screen with score submission
```

## Testing

188 tests across 20 service specs. Run with:

```bash
npm test
```


## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
