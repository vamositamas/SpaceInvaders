# HighScoreService Documentation

A robust high score persistence service with validation, automatic sorting, and a 100-score limit.

## Overview

The `HighScoreService` provides a complete solution for managing game high scores with automatic validation, persistence, sorting, and a configurable maximum limit.

## Features

- ✅ **Automatic Persistence** - Saves scores to disk automatically
- ✅ **Validation** - Comprehensive validation for all score data
- ✅ **Unique IDs** - Auto-generated UUID for each score entry
- ✅ **Auto-Sorting** - Scores always sorted by score descending
- ✅ **100-Score Limit** - Automatically keeps only top 100 scores
- ✅ **Timestamps** - Auto-generated date for each score
- ✅ **Qualification Check** - Test if a score makes the leaderboard
- ✅ **100% Test Coverage** - Fully tested with 17 unit tests

## Score Data Structure

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "playerName": "Alice",
  "score": 15000,
  "level": 10,
  "date": "2024-10-31T12:00:00.000Z",
  "duration": 450
}
```

### Required Fields

- **playerName**: String (1-20 characters)
- **score**: Number (>= 0)
- **level**: Integer (>= 1)

### Auto-Generated Fields

- **id**: UUID v4 (unique identifier)
- **date**: ISO 8601 timestamp

### Optional Fields

- **duration**: Number (game duration in seconds)

## Installation

The service is already included in the project. Simply require it:

```javascript
const HighScoreService = require('./src/services/highscore.service');
const highScoreService = new HighScoreService();
```

## API Reference

### `addHighScore(scoreData)`

Adds a new high score with validation. Automatically generates ID and timestamp.

**Parameters:**
- `scoreData` (object): Score data to add
  - `playerName` (string): Player name (1-20 chars)
  - `score` (number): Score value (>= 0)
  - `level` (number): Level reached (integer >= 1)
  - `duration` (number, optional): Game duration in seconds

**Returns:** `Promise<object>` - Added high score with generated id and date

**Throws:**
- `Error` - "Player name must be between 1 and 20 characters"
- `Error` - "Score must be a non-negative number"
- `Error` - "Level must be an integer >= 1"

**Behavior:**
- Validates all input data
- Generates unique UUID for the score
- Adds current timestamp
- Sorts all scores by score descending
- Keeps only top 100 scores (removes lowest)
- Saves to disk

**Example:**
```javascript
const newScore = await highScoreService.addHighScore({
  playerName: 'Alice',
  score: 15000,
  level: 10,
  duration: 450
});

console.log(`Score ID: ${newScore.id}`);
// Score ID: 550e8400-e29b-41d4-a716-446655440000
```

### `getAllHighScores()`

Gets all high scores sorted by score descending (highest first).

**Returns:** `Promise<Array>` - Array of all high scores, sorted

**Example:**
```javascript
const allScores = await highScoreService.getAllHighScores();
console.log(`Total scores: ${allScores.length}`);
allScores.forEach((score, index) => {
  console.log(`${index + 1}. ${score.playerName}: ${score.score}`);
});
```

### `getTopScores(limit)`

Gets top N high scores.

**Parameters:**
- `limit` (number): Number of scores to return

**Returns:** `Promise<Array>` - Top N scores sorted by score descending

**Example:**
```javascript
const topTen = await highScoreService.getTopScores(10);
console.log('=== TOP 10 ===');
topTen.forEach((score, i) => {
  console.log(`${i + 1}. ${score.playerName}: ${score.score}`);
});
```

### `isHighScore(score)`

Checks if a score qualifies for the top 100 leaderboard.

**Parameters:**
- `score` (number): Score to check

**Returns:** `Promise<boolean>` - True if score qualifies for top 100

**Behavior:**
- Returns `true` if less than 100 scores exist
- Returns `true` if score >= 100th place score
- Returns `false` otherwise

**Example:**
```javascript
const qualifies = await highScoreService.isHighScore(5000);
if (qualifies) {
  console.log('🎉 High score! Enter your name:');
  // Show name entry form
} else {
  console.log('Better luck next time!');
}
```

### `clearAllScores()`

Clears all high scores (for testing/reset).

**Returns:** `Promise<void>`

**Example:**
```javascript
await highScoreService.clearAllScores();
console.log('Leaderboard reset');
```

## Validation Rules

### Player Name
- **Type**: String
- **Length**: 1-20 characters
- **Required**: Yes

### Score
- **Type**: Number
- **Range**: >= 0
- **Required**: Yes

### Level
- **Type**: Integer
- **Range**: >= 1
- **Required**: Yes

### Duration (Optional)
- **Type**: Number
- **Range**: >= 0
- **Required**: No

## Usage Patterns

### Pattern 1: Game Over Flow

```javascript
async function handleGameOver(playerName, finalScore, level, duration) {
  // Check if score qualifies
  const qualifies = await highScoreService.isHighScore(finalScore);
  
  if (qualifies) {
    console.log('🎊 New high score!');
    
    // Add the score
    const newScore = await highScoreService.addHighScore({
      playerName,
      score: finalScore,
      level,
      duration
    });
    
    // Show updated leaderboard
    const topTen = await highScoreService.getTopScores(10);
    displayLeaderboard(topTen);
    
    return newScore;
  } else {
    console.log('Try again!');
    return null;
  }
}
```

### Pattern 2: Display Leaderboard

```javascript
async function showLeaderboard() {
  const topScores = await highScoreService.getTopScores(10);
  
  console.log('╔════════════════════════════════╗');
  console.log('║      HIGH SCORE TABLE          ║');
  console.log('╠════════════════════════════════╣');
  
  topScores.forEach((score, index) => {
    const rank = `${index + 1}.`.padEnd(4);
    const name = score.playerName.padEnd(15);
    const points = score.score.toString().padStart(6);
    console.log(`║ ${rank}${name}${points} pts ║`);
  });
  
  console.log('╚════════════════════════════════╝');
}
```

### Pattern 3: Player Statistics

```javascript
async function getPlayerStats(playerName) {
  const allScores = await highScoreService.getAllHighScores();
  
  const playerScores = allScores.filter(
    s => s.playerName.toLowerCase() === playerName.toLowerCase()
  );
  
  if (playerScores.length === 0) {
    return null;
  }
  
  return {
    bestScore: playerScores[0].score,
    totalGames: playerScores.length,
    averageScore: Math.round(
      playerScores.reduce((sum, s) => sum + s.score, 0) / playerScores.length
    )
  };
}
```

### Pattern 4: Score Submission with Validation

```javascript
async function submitScore(playerName, score, level) {
  try {
    // Validate input before submitting
    if (!playerName || playerName.trim().length === 0) {
      throw new Error('Player name is required');
    }
    
    if (score < 0) {
      throw new Error('Invalid score');
    }
    
    // Submit (will be validated again by service)
    const result = await highScoreService.addHighScore({
      playerName: playerName.trim(),
      score,
      level
    });
    
    console.log('✓ Score saved successfully');
    return result;
  } catch (error) {
    console.error('Failed to save score:', error.message);
    throw error;
  }
}
```

### Pattern 5: Check Before Prompting

```javascript
async function maybePromptForHighScore(score) {
  // Only prompt for name if score qualifies
  const qualifies = await highScoreService.isHighScore(score);
  
  if (!qualifies) {
    return null;
  }
  
  // Show high score entry form
  const playerName = await promptForName();
  
  return await highScoreService.addHighScore({
    playerName,
    score,
    level: currentLevel
  });
}
```

## Error Handling

The service provides specific validation errors:

```javascript
// Empty player name
await highScoreService.addHighScore({ playerName: '', score: 1000, level: 1 });
// Error: Player name must be between 1 and 20 characters

// Name too long
await highScoreService.addHighScore({ 
  playerName: 'ThisNameIsWayTooLongForTheGame', 
  score: 1000, 
  level: 1 
});
// Error: Player name must be between 1 and 20 characters

// Negative score
await highScoreService.addHighScore({ playerName: 'Alice', score: -100, level: 1 });
// Error: Score must be a non-negative number

// Invalid level
await highScoreService.addHighScore({ playerName: 'Alice', score: 1000, level: 0 });
// Error: Level must be an integer >= 1

// Non-integer level
await highScoreService.addHighScore({ playerName: 'Alice', score: 1000, level: 1.5 });
// Error: Level must be an integer >= 1
```

## Storage

- **File**: `/data/highscores/highscores.json`
- **Format**: JSON with `scores` array
- **Max Size**: 100 scores (oldest removed automatically)
- **Sorting**: Always sorted by score descending

**Example File:**
```json
{
  "scores": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "playerName": "Alice",
      "score": 18000,
      "level": 12,
      "date": "2024-10-31T12:00:00.000Z",
      "duration": 520
    },
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "playerName": "Bob",
      "score": 15000,
      "level": 10,
      "date": "2024-10-31T11:30:00.000Z",
      "duration": 450
    }
  ]
}
```

## Testing

Run high score service tests:
```bash
npm test -- tests/unit/services/highscore.service.test.js
```

Run with coverage:
```bash
npm test -- tests/unit/services/highscore.service.test.js --coverage
```

**Test Results:**
- ✅ 17 tests passing
- ✅ Tests all validation rules
- ✅ Tests 100-score limit
- ✅ Tests sorting behavior
- ✅ Tests unique ID generation

## Integration

The HighScoreService uses FileStorageService for persistence:

```javascript
const FileStorageService = require('./file-storage.service');
const { validateHighScore } = require('../models/schemas');
```

This ensures:
- Automatic directory creation
- Pretty-printed JSON
- Consistent error handling
- Reliable file operations

## Best Practices

1. **Check First** - Use `isHighScore()` before prompting for name
2. **Validate Input** - Trim player names and validate scores
3. **Handle Errors** - Always wrap calls in try/catch blocks
4. **Limit Display** - Use `getTopScores()` instead of loading all scores
5. **Clear for Testing** - Use `clearAllScores()` in test setup/teardown
6. **Show Feedback** - Inform users when score qualifies or doesn't
7. **Store Duration** - Track game duration for additional statistics

## Performance

- **Fast Reads**: Scores cached in memory during operations
- **Efficient Writes**: Only writes when adding/clearing scores
- **Sorted Storage**: Scores always stored sorted (no sorting on read)
- **Size Limit**: Maximum 100 scores prevents file growth

## Future Enhancements

Potential features for future versions:
- Score categories (daily, weekly, all-time)
- Player profiles with statistics
- Score verification/anti-cheat
- Backup and restore functionality
- Export to leaderboard API
- Multiplayer mode support
- Achievement tracking

## License

ISC
