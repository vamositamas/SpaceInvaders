# P10 Feature Services - Quick Reference Guide

## Service Overview

This guide provides quick reference for using the three core feature services implemented in P10.

---

## ConfigService

**Purpose**: Manage game configuration with reactive state and API persistence

**Import**:
```typescript
import { ConfigService } from '@core/services';
// or
import { ConfigService } from './core/services/config.service';
```

**Injection**:
```typescript
constructor(private configService: ConfigService) {}
// or modern inject syntax
private configService = inject(ConfigService);
```

### Methods

#### Load Configuration
```typescript
// Load config from API
this.configService.loadConfig();

// Subscribe to config changes
this.configService.config$.subscribe(config => {
  if (config) {
    console.log('Canvas width:', config.canvas.width);
    console.log('Player speed:', config.player.speed);
  }
});
```

#### Update Configuration
```typescript
// Update full config
const newConfig: Partial<GameConfig> = {
  player: { speed: 7, fireRate: 400, lives: 5 }
};
this.configService.updateConfig(newConfig);

// Update single property
this.configService.updateConfigProperty('player.speed', 10);
```

#### Reset Configuration
```typescript
// Reset to defaults
this.configService.resetConfig();
```

#### Synchronous Access
```typescript
// Get current config without subscription
const currentConfig = this.configService.getConfig();
if (currentConfig) {
  console.log('Current speed:', currentConfig.player.speed);
}
```

### Usage Example
```typescript
export class SettingsComponent implements OnInit {
  private configService = inject(ConfigService);
  config: GameConfig | null = null;

  ngOnInit() {
    // Load config on component init
    this.configService.loadConfig();
    
    // Subscribe to config changes
    this.configService.config$.subscribe(config => {
      this.config = config;
    });
  }

  updateSpeed(newSpeed: number) {
    this.configService.updateConfigProperty('player.speed', newSpeed);
  }

  resetToDefaults() {
    this.configService.resetConfig();
  }
}
```

---

## HighScoreService

**Purpose**: Manage high scores with reactive state, API persistence, and sorting

**Import**:
```typescript
import { HighScoreService } from '@core/services';
// or
import { HighScoreService } from './core/services/highscore.service';
```

**Injection**:
```typescript
constructor(private highScoreService: HighScoreService) {}
// or modern inject syntax
private highScoreService = inject(HighScoreService);
```

### Methods

#### Load High Scores
```typescript
// Load scores from API
this.highScoreService.loadHighScores();

// Subscribe to score changes
this.highScoreService.highScores$.subscribe(scores => {
  console.log('Top score:', scores[0]?.score);
  console.log('Total scores:', scores.length);
});
```

#### Add High Score
```typescript
// Add new high score
const newScore: HighScore = {
  playerName: 'John Doe',
  score: 15000,
  level: 5,
  timestamp: new Date()
};
this.highScoreService.addHighScore(newScore);
```

#### Check High Score Qualification
```typescript
// Check if score qualifies as high score
const playerScore = 12000;
if (this.highScoreService.isHighScore(playerScore)) {
  console.log('Congratulations! New high score!');
  // Show name input dialog
}
```

#### Clear High Scores (Admin)
```typescript
// Clear all high scores (admin function)
this.highScoreService.clearHighScores();
```

#### Synchronous Access
```typescript
// Get current scores without subscription
const currentScores = this.highScoreService.getHighScores();
console.log('Top 3 scores:', currentScores.slice(0, 3));
```

### Usage Example
```typescript
export class LeaderboardComponent implements OnInit {
  private highScoreService = inject(HighScoreService);
  highScores: HighScore[] = [];

  ngOnInit() {
    // Load scores on component init
    this.highScoreService.loadHighScores();
    
    // Subscribe to score updates
    this.highScoreService.highScores$.subscribe(scores => {
      this.highScores = scores;
    });
  }

  submitScore(playerName: string, score: number, level: number) {
    if (this.highScoreService.isHighScore(score)) {
      const newScore: HighScore = {
        playerName,
        score,
        level,
        timestamp: new Date()
      };
      this.highScoreService.addHighScore(newScore);
    }
  }
}
```

---

## GameStateService

**Purpose**: Manage game state with reactive updates for score, lives, level, and game status

**Import**:
```typescript
import { GameStateService } from '@core/services';
// or
import { GameStateService } from './core/services/game-state.service';
```

**Injection**:
```typescript
constructor(private gameState: GameStateService) {}
// or modern inject syntax
private gameState = inject(GameStateService);
```

### Observables

The service provides both individual and combined observables:

- `score$` - Observable<number>
- `lives$` - Observable<number>
- `level$` - Observable<number>
- `isPaused$` - Observable<boolean>
- `isGameOver$` - Observable<boolean>
- `gameState$` - Observable<GameState> (combined state)

### Methods

#### Initialize Game
```typescript
// Initialize game with config
this.gameState.initGame(config);

// Subscribe to game state
this.gameState.gameState$.subscribe(state => {
  console.log('Score:', state.score);
  console.log('Lives:', state.lives);
  console.log('Level:', state.level);
  console.log('Playing:', state.isPlaying);
});
```

#### Update Score
```typescript
// Add points to score
this.gameState.updateScore(100);  // Adds 100 points

// Subscribe to score changes
this.gameState.score$.subscribe(score => {
  console.log('Current score:', score);
});
```

#### Manage Lives
```typescript
// Set lives
this.gameState.setLives(2);

// Subscribe to lives changes
this.gameState.lives$.subscribe(lives => {
  console.log('Lives remaining:', lives);
  if (lives === 0) {
    this.gameState.gameOver();
  }
});
```

#### Manage Level
```typescript
// Set level
this.gameState.setLevel(2);

// Subscribe to level changes
this.gameState.level$.subscribe(level => {
  console.log('Current level:', level);
});
```

#### Pause/Resume
```typescript
// Pause game
this.gameState.pause();

// Resume game
this.gameState.resume();

// Subscribe to pause state
this.gameState.isPaused$.subscribe(isPaused => {
  console.log('Game paused:', isPaused);
});
```

#### Game Over
```typescript
// Trigger game over
this.gameState.gameOver();

// Subscribe to game over state
this.gameState.isGameOver$.subscribe(isGameOver => {
  if (isGameOver) {
    console.log('Game Over!');
    // Show game over screen
  }
});
```

#### Reset Game
```typescript
// Reset all state to defaults
this.gameState.resetGame();
```

#### Synchronous Access
```typescript
// Get current state without subscription
const currentState = this.gameState.getCurrentState();
console.log('Current score:', currentState.score);
console.log('Is paused:', currentState.isPaused);
```

### Usage Example - Game Component
```typescript
export class GameComponent implements OnInit, OnDestroy {
  private gameState = inject(GameStateService);
  private configService = inject(ConfigService);
  private destroy$ = new Subject<void>();
  
  score = 0;
  lives = 3;
  level = 1;
  isPaused = false;

  ngOnInit() {
    // Subscribe to individual observables
    this.gameState.score$
      .pipe(takeUntil(this.destroy$))
      .subscribe(score => this.score = score);
    
    this.gameState.lives$
      .pipe(takeUntil(this.destroy$))
      .subscribe(lives => this.lives = lives);
    
    this.gameState.level$
      .pipe(takeUntil(this.destroy$))
      .subscribe(level => this.level = level);
    
    this.gameState.isPaused$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isPaused => this.isPaused = isPaused);
    
    // Initialize game
    const config = this.configService.getConfig();
    if (config) {
      this.gameState.initGame(config);
    }
  }

  onEnemyDestroyed(points: number) {
    this.gameState.updateScore(points);
  }

  onPlayerHit() {
    const currentLives = this.gameState.getCurrentState().lives;
    this.gameState.setLives(currentLives - 1);
    
    if (currentLives - 1 <= 0) {
      this.gameState.gameOver();
    }
  }

  onLevelComplete() {
    const currentLevel = this.gameState.getCurrentState().level;
    this.gameState.setLevel(currentLevel + 1);
  }

  togglePause() {
    const state = this.gameState.getCurrentState();
    if (state.isPaused) {
      this.gameState.resume();
    } else {
      this.gameState.pause();
    }
  }

  restartGame() {
    this.gameState.resetGame();
    const config = this.configService.getConfig();
    if (config) {
      this.gameState.initGame(config);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### Usage Example - HUD Component
```typescript
export class HudComponent implements OnInit {
  private gameState = inject(GameStateService);
  
  // Use combined gameState$ observable
  gameState$ = this.gameState.gameState$;

  ngOnInit() {
    // Optional: can also access individual observables
    // this.score$ = this.gameState.score$;
    // this.lives$ = this.gameState.lives$;
  }
}
```

**Template**:
```html
<div class="hud" *ngIf="gameState$ | async as state">
  <div class="score">Score: {{ state.score }}</div>
  <div class="lives">Lives: {{ state.lives }}</div>
  <div class="level">Level: {{ state.level }}</div>
  <div class="status" *ngIf="state.isPaused">PAUSED</div>
  <div class="status" *ngIf="state.isGameOver">GAME OVER</div>
</div>
```

---

## Common Patterns

### 1. Service Communication
```typescript
export class GameOverComponent {
  private gameState = inject(GameStateService);
  private highScoreService = inject(HighScoreService);

  onGameOver() {
    const state = this.gameState.getCurrentState();
    
    if (this.highScoreService.isHighScore(state.score)) {
      // Show high score entry dialog
      this.showHighScoreDialog(state.score, state.level);
    }
  }

  submitHighScore(playerName: string) {
    const state = this.gameState.getCurrentState();
    this.highScoreService.addHighScore({
      playerName,
      score: state.score,
      level: state.level,
      timestamp: new Date()
    });
  }
}
```

### 2. Reactive UI Updates
```typescript
export class GameComponent {
  private gameState = inject(GameStateService);
  
  // Expose observables directly to template
  score$ = this.gameState.score$;
  lives$ = this.gameState.lives$;
  level$ = this.gameState.level$;
  isPaused$ = this.gameState.isPaused$;
}
```

**Template**:
```html
<div class="game-info">
  <span>Score: {{ score$ | async }}</span>
  <span>Lives: {{ lives$ | async }}</span>
  <span>Level: {{ level$ | async }}</span>
  <span *ngIf="isPaused$ | async">PAUSED</span>
</div>
```

### 3. Multiple Service Coordination
```typescript
export class GameManagerService {
  private gameState = inject(GameStateService);
  private configService = inject(ConfigService);
  private highScoreService = inject(HighScoreService);

  startNewGame() {
    // Load config
    this.configService.loadConfig();
    const config = this.configService.getConfig();
    
    if (config) {
      // Initialize game state
      this.gameState.initGame(config);
      
      // Load high scores for reference
      this.highScoreService.loadHighScores();
    }
  }

  endGame() {
    const state = this.gameState.getCurrentState();
    
    // Check for high score
    if (this.highScoreService.isHighScore(state.score)) {
      return true; // Indicate high score achieved
    }
    
    return false;
  }
}
```

---

## Best Practices

### 1. Always Unsubscribe
```typescript
import { Subject, takeUntil } from 'rxjs';

export class MyComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.gameState.score$
      .pipe(takeUntil(this.destroy$))
      .subscribe(score => {
        // Handle score update
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### 2. Use Async Pipe When Possible
```typescript
// Component
export class MyComponent {
  score$ = this.gameState.score$;
}

// Template
{{ score$ | async }}
```

### 3. Combine Observables
```typescript
import { combineLatest, map } from 'rxjs';

export class MyComponent {
  // Combine multiple observables
  gameInfo$ = combineLatest([
    this.gameState.score$,
    this.gameState.level$,
    this.gameState.lives$
  ]).pipe(
    map(([score, level, lives]) => ({
      score,
      level,
      lives,
      canContinue: lives > 0
    }))
  );
}
```

### 4. Error Handling
```typescript
export class MyComponent {
  ngOnInit() {
    this.configService.config$
      .pipe(
        filter(config => config !== null),
        catchError(error => {
          console.error('Config error:', error);
          return of(null);
        })
      )
      .subscribe(config => {
        // Use config
      });
  }
}
```

---

## TypeScript Interfaces

### GameConfig
```typescript
interface GameConfig {
  canvas: { width: number; height: number };
  player: { speed: number; fireRate: number; lives: number };
  enemies: { 
    rows: number; 
    columns: number; 
    baseSpeed: number; 
    speedIncrement: number; 
    fireRate: number 
  };
  difficulty: {
    easy: { speedMultiplier: number; fireRateMultiplier: number };
    normal: { speedMultiplier: number; fireRateMultiplier: number };
    hard: { speedMultiplier: number; fireRateMultiplier: number };
  };
}
```

### HighScore
```typescript
interface HighScore {
  id?: string;
  playerName: string;
  score: number;
  level: number;
  timestamp: Date;
}
```

### GameState
```typescript
interface GameState {
  score: number;
  lives: number;
  level: number;
  isPaused: boolean;
  isGameOver: boolean;
  isPlaying: boolean;
}
```

---

## Testing Services

### Example Test
```typescript
import { TestBed } from '@angular/core/testing';
import { GameStateService } from './game-state.service';

describe('GameStateService', () => {
  let service: GameStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameStateService);
  });

  it('should update score', (done) => {
    service.updateScore(100);
    
    service.score$.subscribe(score => {
      if (score === 100) {
        expect(score).toBe(100);
        done();
      }
    });
  });
});
```

---

## Additional Resources

- **Implementation Summary**: `/docs/ai documents/P10_IMPLEMENTATION_SUMMARY.md`
- **Completion Document**: `/docs/ai documents/P10_COMPLETE.md`
- **Prompt Document**: `/docs/prompts/P10 - Feature Services.md`
- **Source Code**: `/space-invaders-client/src/app/core/services/`
- **Test Files**: `/space-invaders-client/src/app/core/services/*.spec.ts`

---

**Last Updated**: November 28, 2025  
**Phase**: P10 - Feature Services  
**Status**: Complete ✅
