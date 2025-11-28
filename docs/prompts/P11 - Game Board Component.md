# P11 - Game Board Component

**Phase**: Frontend Development - Component Implementation  
**Dependencies**: P7 (Angular Setup), P8 (Canvas Service), P9 (API Service), P10 (Feature Services)  
**Methodology**: Test-Driven Development (TDD)

---

## Overview

Create the game board component with canvas integration, HUD display, and responsive layout. This component will be the main game container that coordinates the game loop, rendering, and state display.

---

## Objectives

### 1. Game Board Component
Create the main game container component that integrates with CanvasService for rendering:
- Canvas initialization and management
- Responsive canvas sizing
- Coordinate system management
- Background rendering
- Component lifecycle management

### 2. HUD Component
Create heads-up display component for game information:
- Display score, lives, level
- Subscribe to GameStateService observables
- Real-time reactive updates
- Pause/Game Over state indicators
- Responsive design

### 3. Game Container Component
Create container layout for game area:
- Material Design layout
- Game board + HUD composition
- Responsive sizing
- Theme integration

---

## TDD Requirements

### Phase 1: RED - Write Tests First

#### Game Board Component Tests (`game-board.component.spec.ts`)

Create comprehensive unit tests covering:

1. **Component Creation**
   - Component should be created successfully
   - Canvas element should be present in template

2. **Canvas Initialization**
   - Should call CanvasService.initCanvas on ngAfterViewInit
   - Should pass correct canvas element and dimensions
   - Should handle canvas initialization errors

3. **Canvas Sizing**
   - Should set default canvas dimensions from config
   - Should update canvas size on window resize
   - Should maintain aspect ratio

4. **Lifecycle**
   - Should clean up on component destroy
   - Should stop animation frame on destroy

5. **Rendering**
   - Should clear canvas each frame
   - Should call render method in animation loop
   - Should not render when paused

6. **State Integration**
   - Should subscribe to GameStateService
   - Should handle pause state
   - Should handle game over state

#### HUD Component Tests (`hud.component.spec.ts`)

Create comprehensive unit tests covering:

1. **Component Creation**
   - Component should be created successfully
   - Should display initial state

2. **State Subscription**
   - Should subscribe to GameStateService.gameState$
   - Should update displayed values when state changes
   - Should unsubscribe on destroy

3. **Display Updates**
   - Should display score correctly
   - Should display lives correctly
   - Should display level correctly
   - Should show "PAUSED" when paused
   - Should show "GAME OVER" when game over

4. **Template Rendering**
   - Should render all game info elements
   - Should apply correct CSS classes for states
   - Should use Material components

#### Game Container Component Tests (`game-container.component.spec.ts`)

Create comprehensive unit tests covering:

1. **Component Creation**
   - Component should be created successfully
   - Should contain game-board component
   - Should contain hud component

2. **Layout**
   - Should use Material card for container
   - Should have responsive grid layout
   - Should apply correct flex styles

3. **Service Integration**
   - Should inject ConfigService
   - Should inject GameStateService
   - Should initialize game on component init

### Phase 2: GREEN - Implement Components

#### Game Board Component Implementation

**File**: `/src/app/features/game/game-board/game-board.component.ts`

```typescript
import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CanvasService } from '@core/services/canvas.service';
import { ConfigService } from '@core/services/config.service';
import { GameStateService } from '@core/services/game-state.service';
import { GameConfig } from '@core/models';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [],
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.scss'
})
export class GameBoardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('gameCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  
  private destroy$ = new Subject<void>();
  private animationFrameId?: number;
  private config: GameConfig | null = null;
  private isPaused = false;
  private isGameOver = false;

  constructor(
    private canvasService: CanvasService,
    private configService: ConfigService,
    private gameStateService: GameStateService
  ) {}

  ngOnInit(): void {
    // Subscribe to config
    this.configService.config$
      .pipe(takeUntil(this.destroy$))
      .subscribe(config => {
        this.config = config;
      });

    // Subscribe to game state
    this.gameStateService.isPaused$
      .pipe(takeUntil(this.destroy$))
      .subscribe(paused => {
        this.isPaused = paused;
      });

    this.gameStateService.isGameOver$
      .pipe(takeUntil(this.destroy$))
      .subscribe(gameOver => {
        this.isGameOver = gameOver;
        if (gameOver) {
          this.stopGameLoop();
        }
      });
  }

  ngAfterViewInit(): void {
    this.initializeCanvas();
    this.startGameLoop();
  }

  ngOnDestroy(): void {
    this.stopGameLoop();
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeCanvas(): void {
    if (!this.config) {
      console.error('Config not loaded');
      return;
    }

    const canvas = this.canvasRef.nativeElement;
    const { width, height } = this.config.canvas;
    
    this.canvasService.initCanvas(canvas, width, height);
  }

  private startGameLoop(): void {
    const gameLoop = () => {
      if (!this.isPaused && !this.isGameOver) {
        this.render();
      }
      this.animationFrameId = requestAnimationFrame(gameLoop);
    };
    this.animationFrameId = requestAnimationFrame(gameLoop);
  }

  private stopGameLoop(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = undefined;
    }
  }

  private render(): void {
    this.canvasService.clearCanvas();
    
    // Draw background (black)
    if (this.config) {
      this.canvasService.drawRect(
        0, 
        0, 
        this.config.canvas.width, 
        this.config.canvas.height, 
        '#000000'
      );
    }

    // TODO: Draw game objects (player, enemies, projectiles)
  }
}
```

**Template**: `/src/app/features/game/game-board/game-board.component.html`

```html
<div class="game-board-container">
  <canvas #gameCanvas class="game-canvas"></canvas>
</div>
```

**Styles**: `/src/app/features/game/game-board/game-board.component.scss`

```scss
.game-board-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #000;
}

.game-canvas {
  border: 2px solid #333;
  display: block;
  max-width: 100%;
  max-height: 100%;
}
```

#### HUD Component Implementation

**File**: `/src/app/features/game/hud/hud.component.ts`

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { GameStateService } from '@core/services/game-state.service';
import { GameState } from '@core/models';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-hud',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './hud.component.html',
  styleUrl: './hud.component.scss'
})
export class HudComponent implements OnInit, OnDestroy {
  gameState: GameState = {
    score: 0,
    lives: 3,
    level: 1,
    isPaused: false,
    isGameOver: false,
    isPlaying: false
  };

  private destroy$ = new Subject<void>();

  constructor(private gameStateService: GameStateService) {}

  ngOnInit(): void {
    this.gameStateService.gameState$
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.gameState = state;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

**Template**: `/src/app/features/game/hud/hud.component.html`

```html
<mat-card class="hud-container">
  <mat-card-content class="hud-content">
    <div class="hud-item">
      <mat-icon>star</mat-icon>
      <span class="hud-label">Score:</span>
      <span class="hud-value">{{ gameState.score }}</span>
    </div>
    
    <div class="hud-item">
      <mat-icon>favorite</mat-icon>
      <span class="hud-label">Lives:</span>
      <span class="hud-value">{{ gameState.lives }}</span>
    </div>
    
    <div class="hud-item">
      <mat-icon>trending_up</mat-icon>
      <span class="hud-label">Level:</span>
      <span class="hud-value">{{ gameState.level }}</span>
    </div>
    
    <div class="hud-status" *ngIf="gameState.isPaused">
      <span class="status-text paused">PAUSED</span>
    </div>
    
    <div class="hud-status" *ngIf="gameState.isGameOver">
      <span class="status-text game-over">GAME OVER</span>
    </div>
  </mat-card-content>
</mat-card>
```

**Styles**: `/src/app/features/game/hud/hud.component.scss`

```scss
.hud-container {
  background-color: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 16px;
}

.hud-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
}

.hud-item {
  display: flex;
  align-items: center;
  gap: 8px;
  
  mat-icon {
    color: #64B5F6;
  }
}

.hud-label {
  font-weight: 500;
  font-size: 14px;
}

.hud-value {
  font-weight: 700;
  font-size: 18px;
  color: #64B5F6;
}

.hud-status {
  flex: 1;
  text-align: center;
}

.status-text {
  font-size: 24px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  
  &.paused {
    color: #FFA726;
    animation: blink 1s infinite;
  }
  
  &.game-over {
    color: #EF5350;
  }
}

@keyframes blink {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0.3; }
}
```

#### Game Container Component Implementation

**File**: `/src/app/features/game/game-container/game-container.component.ts`

```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { GameBoardComponent } from '../game-board/game-board.component';
import { HudComponent } from '../hud/hud.component';
import { ConfigService } from '@core/services/config.service';
import { GameStateService } from '@core/services/game-state.service';

@Component({
  selector: 'app-game-container',
  standalone: true,
  imports: [CommonModule, MatCardModule, GameBoardComponent, HudComponent],
  templateUrl: './game-container.component.html',
  styleUrl: './game-container.component.scss'
})
export class GameContainerComponent implements OnInit {
  constructor(
    private configService: ConfigService,
    private gameStateService: GameStateService
  ) {}

  ngOnInit(): void {
    // Load configuration
    this.configService.loadConfig();
    
    // Initialize game when config is loaded
    this.configService.config$.subscribe(config => {
      if (config) {
        this.gameStateService.initGame(config);
      }
    });
  }
}
```

**Template**: `/src/app/features/game/game-container/game-container.component.html`

```html
<div class="game-container">
  <mat-card class="game-card">
    <mat-card-header>
      <mat-card-title>Space Invaders</mat-card-title>
    </mat-card-header>
    
    <mat-card-content class="game-content">
      <app-hud></app-hud>
      <app-game-board></app-game-board>
    </mat-card-content>
  </mat-card>
</div>
```

**Styles**: `/src/app/features/game/game-container/game-container.component.scss`

```scss
.game-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 24px;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
}

.game-card {
  max-width: 900px;
  width: 100%;
}

.game-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
}

@media (max-width: 768px) {
  .game-container {
    padding: 8px;
  }
  
  .game-content {
    padding: 8px;
  }
}
```

### Phase 3: REFACTOR - Improve Code Quality

- Extract magic numbers to constants
- Add comprehensive JSDoc comments
- Ensure proper cleanup of subscriptions
- Optimize rendering performance
- Add keyboard event handling (for future use)
- Implement responsive canvas sizing

### Phase 4: DOCUMENT - Create Documentation

Create comprehensive documentation:
- Component usage examples
- Integration guide
- State management flow
- Rendering pipeline explanation

---

## Component Generation Commands

```bash
# Navigate to Angular project
cd space-invaders-client

# Generate Game Board Component
ng generate component features/game/game-board --standalone

# Generate HUD Component
ng generate component features/game/hud --standalone

# Generate Game Container Component
ng generate component features/game/game-container --standalone
```

---

## Testing Requirements

### Test Coverage Goals
- **Game Board Component**: 100% coverage
  - Canvas initialization: 100%
  - Lifecycle methods: 100%
  - Rendering loop: 100%
  - State management: 100%

- **HUD Component**: 100% coverage
  - State subscription: 100%
  - Template rendering: 100%
  - State display: 100%

- **Game Container Component**: 100% coverage
  - Component composition: 100%
  - Service injection: 100%
  - Initialization: 100%

### Test Execution
```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --code-coverage

# Run tests in watch mode
npm test -- --watch
```

---

## Deliverables

### Components
1. ✅ `game-board.component.ts` - Main game canvas component
2. ✅ `game-board.component.html` - Canvas template
3. ✅ `game-board.component.scss` - Canvas styles
4. ✅ `game-board.component.spec.ts` - Component tests

5. ✅ `hud.component.ts` - Heads-up display component
6. ✅ `hud.component.html` - HUD template
7. ✅ `hud.component.scss` - HUD styles
8. ✅ `hud.component.spec.ts` - HUD tests

9. ✅ `game-container.component.ts` - Game container component
10. ✅ `game-container.component.html` - Container template
11. ✅ `game-container.component.scss` - Container styles
12. ✅ `game-container.component.spec.ts` - Container tests

### Documentation
13. ✅ `P11_IMPLEMENTATION_SUMMARY.md` - Implementation details
14. ✅ `P11_COMPLETE.md` - Completion report

### Testing
15. ✅ All unit tests passing
16. ✅ 100% code coverage on components
17. ✅ Integration with existing services verified

---

## Success Criteria

- [  ] All three components created with standalone configuration
- [  ] Game board integrates with CanvasService successfully
- [  ] HUD displays game state reactively
- [  ] Game container composes components correctly
- [  ] All tests passing (target: 20+ new tests)
- [  ] 100% test coverage on component code
- [  ] Canvas renders without flickering
- [  ] Responsive design works on different screen sizes
- [  ] Clean subscription management (no memory leaks)
- [  ] Material Design integration complete
- [  ] Full JSDoc documentation
- [  ] TDD workflow followed (RED-GREEN-REFACTOR-DOCUMENT)

---

## Integration Points

### Services Used
- `CanvasService` - Canvas rendering operations
- `ConfigService` - Game configuration
- `GameStateService` - Game state management

### Future Integration
- P12: Player sprite rendering
- P13: Enemy sprites rendering
- P14: Game loop logic
- P15: Menu screen navigation
- P16: Game over screen
- P17: Leaderboard display

---

## Notes

- Use Angular's `@ViewChild` to access canvas element
- Implement proper cleanup in `ngOnDestroy`
- Use `requestAnimationFrame` for smooth rendering
- Handle window resize events for responsive canvas
- Use `takeUntil` pattern for subscription management
- Material components for consistent UI
- Follow Angular best practices for standalone components

---

## Estimated Complexity

**Time Estimate**: 2-3 hours
**Difficulty**: Medium
**Test Count**: ~20 unit tests
**Files Created**: 12 files
**Dependencies**: P7, P8, P9, P10

---

**Phase**: P11 - Game Board Component  
**Status**: Ready for Implementation  
**Methodology**: TDD (Test-Driven Development)
