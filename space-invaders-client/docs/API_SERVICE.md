# API Service Documentation

## Overview

The `ApiService` provides a type-safe HTTP client for communicating with the Node.js backend API. It handles all REST API endpoints for game configuration and high score management with built-in error handling and retry logic.

## Features

- ✅ **Type-Safe**: Uses TypeScript interfaces for request/response types
- ✅ **Error Handling**: Comprehensive error catching and logging
- ✅ **Retry Logic**: Automatically retries failed requests (up to 2 retries)
- ✅ **Environment Configuration**: Uses environment-based API URLs
- ✅ **RxJS Observables**: Returns observables for reactive programming
- ✅ **Full Backend Coverage**: All backend endpoints integrated

## Installation

The service is automatically available through Angular's dependency injection:

```typescript
import { ApiService } from './core/services/api.service';

@Component({
  selector: 'app-game',
  // ...
})
export class GameComponent {
  constructor(private apiService: ApiService) {}
}
```

## API Methods

### Configuration Management

#### `getConfig(): Observable<GameConfig>`

Retrieves the current game configuration.

**Returns**: Observable of GameConfig

**Example**:
```typescript
this.apiService.getConfig().subscribe({
  next: (config) => {
    console.log('Canvas size:', config.canvas.width, 'x', config.canvas.height);
    console.log('Player lives:', config.player.lives);
  },
  error: (error) => {
    console.error('Failed to load config:', error);
  }
});
```

---

#### `updateConfig(config: Partial<GameConfig>): Observable<GameConfig>`

Updates game configuration with partial data.

**Parameters**:
- `config`: Partial<GameConfig> - Configuration properties to update

**Returns**: Observable of updated GameConfig

**Example**:
```typescript
this.apiService.updateConfig({
  player: {
    speed: 10,
    fireRate: 300,
    lives: 5
  }
}).subscribe({
  next: (config) => console.log('Config updated:', config),
  error: (error) => console.error('Update failed:', error)
});
```

---

#### `updateConfigProperty(property: string, value: any): Observable<GameConfig>`

Updates a single configuration property.

**Parameters**:
- `property`: string - Property path (e.g., 'player.speed', 'canvas.width')
- `value`: any - New value for the property

**Returns**: Observable of updated GameConfig

**Example**:
```typescript
this.apiService.updateConfigProperty('player.speed', 15).subscribe({
  next: (config) => console.log('Speed updated:', config.player.speed),
  error: (error) => console.error('Update failed:', error)
});
```

---

#### `resetConfig(): Observable<GameConfig>`

Resets configuration to default values.

**Returns**: Observable of reset GameConfig

**Example**:
```typescript
this.apiService.resetConfig().subscribe({
  next: (config) => console.log('Config reset to defaults:', config),
  error: (error) => console.error('Reset failed:', error)
});
```

---

### High Score Management

#### `getHighScores(limit?: number): Observable<HighScore[]>`

Retrieves high scores with optional limit.

**Parameters**:
- `limit`: number (optional) - Maximum number of scores to return

**Returns**: Observable of HighScore array

**Example**:
```typescript
// Get top 10 scores
this.apiService.getHighScores(10).subscribe({
  next: (scores) => {
    scores.forEach((score, index) => {
      console.log(`${index + 1}. ${score.playerName}: ${score.score}`);
    });
  },
  error: (error) => console.error('Failed to load scores:', error)
});

// Get all scores
this.apiService.getHighScores().subscribe({
  next: (scores) => console.log('All scores:', scores)
});
```

---

#### `addHighScore(score: HighScore): Observable<HighScore>`

Adds a new high score.

**Parameters**:
- `score`: HighScore - Score data to add

**Returns**: Observable of created HighScore with generated ID

**Example**:
```typescript
const newScore: HighScore = {
  playerName: 'Player1',
  score: 15000,
  level: 8,
  duration: 450
};

this.apiService.addHighScore(newScore).subscribe({
  next: (score) => {
    console.log('Score added with ID:', score.id);
  },
  error: (error) => console.error('Failed to add score:', error)
});
```

---

#### `getHighScoreById(id: string): Observable<HighScore>`

Retrieves a specific high score by ID.

**Parameters**:
- `id`: string - High score ID

**Returns**: Observable of HighScore

**Example**:
```typescript
this.apiService.getHighScoreById('abc123').subscribe({
  next: (score) => {
    console.log('Score:', score.playerName, '-', score.score);
  },
  error: (error) => console.error('Score not found:', error)
});
```

---

#### `deleteHighScore(id: string): Observable<void>`

Deletes a high score by ID.

**Parameters**:
- `id`: string - High score ID to delete

**Returns**: Observable of void

**Example**:
```typescript
this.apiService.deleteHighScore('abc123').subscribe({
  next: () => console.log('Score deleted successfully'),
  error: (error) => console.error('Delete failed:', error)
});
```

---

## Error Handling

The service automatically handles errors and logs them to the console. All methods include:

1. **Retry Logic**: Failed requests are automatically retried up to 2 times
2. **Error Transformation**: HTTP errors are transformed into user-friendly messages
3. **Observable Errors**: Errors are propagated through the observable stream

**Example Error Handling**:
```typescript
this.apiService.getConfig().subscribe({
  next: (config) => {
    // Handle success
  },
  error: (error: HttpErrorResponse) => {
    if (error.status === 404) {
      console.error('Config not found');
    } else if (error.status === 500) {
      console.error('Server error');
    } else {
      console.error('Unknown error:', error.message);
    }
  }
});
```

---

## Configuration

### Environment Variables

The service uses environment configuration for the API base URL:

**development** (`src/environments/environment.ts`):
```typescript
export const environment = {
  production: false,
  apiUrl: '/api'  // Uses proxy in development
};
```

**production** (`src/environments/environment.prod.ts`):
```typescript
export const environment = {
  production: true,
  apiUrl: 'http://localhost:3000/api'
};
```

---

## Type Definitions

### GameConfig Interface

```typescript
interface GameConfig {
  canvas: {
    width: number;
    height: number;
  };
  player: {
    speed: number;
    fireRate: number;
    lives: number;
  };
  enemies: {
    rows: number;
    columns: number;
    baseSpeed: number;
    speedIncrement: number;
    fireRate: number;
  };
  difficulty: {
    easy: DifficultyLevel;
    normal: DifficultyLevel;
    hard: DifficultyLevel;
  };
}

interface DifficultyLevel {
  speedMultiplier: number;
  fireRateMultiplier: number;
}
```

### HighScore Interface

```typescript
interface HighScore {
  id?: string;
  playerName: string;
  score: number;
  level: number;
  date?: string;
  duration?: number;
}
```

---

## Testing

The service has comprehensive unit test coverage:

```bash
npm test -- --include='**/api.service.spec.ts'
```

**Test Coverage**:
- ✅ Service creation (1 test)
- ✅ Config API operations (4 tests)
- ✅ High score API operations (5 tests)
- ✅ Error handling (2 tests)
- ✅ Retry logic (2 tests)

**Total**: 14 tests, all passing

---

## Best Practices

1. **Always Subscribe**: Observables are lazy, so always subscribe to trigger the HTTP request
2. **Unsubscribe**: Use takeUntil or async pipe to prevent memory leaks
3. **Error Handling**: Always provide error handlers in subscriptions
4. **Type Safety**: Use the provided interfaces for type checking

**Example with Unsubscribe**:
```typescript
import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export class GameComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(private apiService: ApiService) {
    this.apiService.getConfig()
      .pipe(takeUntil(this.destroy$))
      .subscribe(config => {
        // Handle config
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

---

## Related Files

- **Service**: `/src/app/core/services/api.service.ts`
- **Tests**: `/src/app/core/services/api.service.spec.ts`
- **Interfaces**: `/src/app/core/models/`
- **Environment**: `/src/environments/`

---

## Future Enhancements

- [ ] Add request caching
- [ ] Implement request cancellation
- [ ] Add WebSocket support for real-time updates
- [ ] Create interceptors for authentication
- [ ] Add request/response logging in dev mode
