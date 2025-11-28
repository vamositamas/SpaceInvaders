# P10 - Feature Services (State Management)

Create Angular services to manage application state for configuration, high scores, and game lifecycle.

## Requirements

### 1. ConfigService - Game Configuration State Management
Create `/src/app/core/services/config.service.ts` with:
- `config$: Observable<GameConfig>` - Observable stream of current configuration
- `loadConfig(): void` - Loads config from API
- `updateConfig(config: Partial<GameConfig>): void` - Updates config
- `updateConfigProperty(property: string, value: any): void` - Updates single property
- `resetConfig(): void` - Resets to default configuration
- `getConfig(): GameConfig` - Returns current config synchronously
- Cache config locally using BehaviorSubject
- Inject ApiService for backend communication

### 2. HighScoreService - High Score State Management
Create `/src/app/core/services/highscore.service.ts` with:
- `highScores$: Observable<HighScore[]>` - Observable stream of high scores
- `loadHighScores(limit?: number): void` - Loads scores from API
- `addHighScore(score: HighScore): Observable<HighScore>` - Submits new score
- `isHighScore(score: number): Observable<boolean>` - Checks if score qualifies
- `getHighScores(): HighScore[]` - Returns cached scores synchronously
- Cache scores locally using BehaviorSubject
- Inject ApiService for backend communication

### 3. GameStateService - Game Lifecycle Management
Create `/src/app/core/services/game-state.service.ts` with:
- `gameState$: Observable<GameState>` - Observable stream of game state
- `score$: Observable<number>` - Current score
- `lives$: Observable<number>` - Remaining lives
- `level$: Observable<number>` - Current level
- `isPaused$: Observable<boolean>` - Pause state
- `isGameOver$: Observable<boolean>` - Game over state
- `initGame(config: GameConfig): void` - Initializes new game
- `updateScore(points: number): void` - Adds points to score
- `setLives(lives: number): void` - Updates lives
- `setLevel(level: number): void` - Updates level
- `pause(): void` - Pauses game
- `resume(): void` - Resumes game
- `gameOver(): void` - Triggers game over
- `resetGame(): void` - Resets all state

### 4. GameState Interface
Create `/src/app/core/models/game-state.interface.ts`:
```typescript
export interface GameState {
  score: number;
  lives: number;
  level: number;
  isPaused: boolean;
  isGameOver: boolean;
  isPlaying: boolean;
}
```

## TDD Approach

### Step 1: Write Tests First (RED)

**ConfigService Tests** (`config.service.spec.ts`):
- ✓ Service creates successfully
- ✓ config$ observable emits initial value
- ✓ loadConfig calls ApiService.getConfig()
- ✓ loadConfig updates config$ observable
- ✓ updateConfig calls ApiService.updateConfig()
- ✓ updateConfig updates local cache
- ✓ updateConfigProperty calls correct API method
- ✓ resetConfig calls ApiService.resetConfig()
- ✓ getConfig returns cached config synchronously
- ✓ Error handling when API calls fail

**HighScoreService Tests** (`highscore.service.spec.ts`):
- ✓ Service creates successfully
- ✓ highScores$ observable emits initial empty array
- ✓ loadHighScores calls ApiService.getHighScores()
- ✓ loadHighScores with limit passes parameter
- ✓ loadHighScores updates highScores$ observable
- ✓ addHighScore calls ApiService.addHighScore()
- ✓ addHighScore refreshes local cache after success
- ✓ isHighScore checks against lowest cached score
- ✓ isHighScore returns true if cache < 100 scores
- ✓ getHighScores returns cached scores synchronously

**GameStateService Tests** (`game-state.service.spec.ts`):
- ✓ Service creates successfully
- ✓ All observables emit initial values
- ✓ initGame sets initial state from config
- ✓ updateScore adds points to current score
- ✓ updateScore emits new score value
- ✓ setLives updates lives observable
- ✓ setLevel updates level observable
- ✓ pause sets isPaused to true
- ✓ resume sets isPaused to false
- ✓ gameOver sets isGameOver to true
- ✓ gameOver sets isPlaying to false
- ✓ resetGame resets all state to defaults
- ✓ gameState$ combines all state observables

### Step 2: Create Interfaces
- Create `game-state.interface.ts` with GameState interface
- Export from `/src/app/core/models/index.ts`

### Step 3: Implement Services (GREEN)
- Implement ConfigService with BehaviorSubjects
- Implement HighScoreService with BehaviorSubjects
- Implement GameStateService with BehaviorSubjects
- Use combineLatest for composite observables
- Inject ApiService in Config and HighScore services
- Add proper error handling with catchError
- Make all tests pass

### Step 4: Refactor
- Extract common patterns to base class if needed
- Optimize observable subscriptions
- Add JSDoc documentation
- Ensure memory leak prevention (unsubscribe)

### Step 5: Verify
- Run all tests: `npm test`
- Check test coverage (aim for 100%)
- Verify no memory leaks in observables
- Test state persistence across component lifecycle

## Expected Test Results

```
✅ Total Tests: ~45 (31 existing + ~14 new)
   - ConfigService: ~10 tests
   - HighScoreService: ~10 tests  
   - GameStateService: ~12 tests
   - Existing tests: 31 tests

✅ Coverage: 100% of all service methods
✅ All observables tested for emissions
✅ All API integrations tested
```

## Deliverable

Working feature services with:
- State management using RxJS BehaviorSubjects
- Observable streams for reactive components
- API integration for config and scores
- Game lifecycle management
- Full unit test coverage (100%)
- Memory-safe observable handling
- Clean, documented code

## Integration Points

✅ **With ApiService**
- ConfigService uses ApiService for backend calls
- HighScoreService uses ApiService for backend calls

✅ **With Components (Future)**
- Components subscribe to observable streams
- Components call service methods to update state
- Reactive UI updates on state changes

✅ **State Flow**
```
Component → Service Method → API Call → Update BehaviorSubject → Observable Emits → Component Updates
```

## Next Steps After P10

Ready for **P11: Game Board Component**
- Use ConfigService for game configuration
- Use GameStateService for game state
- Integrate CanvasService for rendering
- Build actual game UI
