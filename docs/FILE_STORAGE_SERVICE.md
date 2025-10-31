# FileStorageService Documentation

A robust, fully-tested service for managing JSON file storage operations with comprehensive error handling.

## Overview

The `FileStorageService` provides a simple and reliable interface for reading, writing, and managing JSON files. It includes automatic directory creation, backup functionality, and graceful error handling.

## Features

- ✅ **100% Test Coverage** - All code paths thoroughly tested
- ✅ **Async/Await** - Modern Promise-based API
- ✅ **Error Handling** - Comprehensive error messages for debugging
- ✅ **Auto-Create Directories** - Automatically creates parent directories when writing
- ✅ **Pretty Printing** - JSON files are formatted with 2-space indentation
- ✅ **Backup Support** - Easy file backup before modifications
- ✅ **Type Safety** - JSDoc comments for IDE autocomplete

## Installation

The service is already included in the project. Simply require it:

```javascript
const FileStorageService = require('./src/services/file-storage.service');
const storage = new FileStorageService();
```

## API Reference

### `readJSON(filepath)`

Reads and parses a JSON file.

**Parameters:**
- `filepath` (string): Absolute or relative path to the JSON file

**Returns:** `Promise<any>` - Parsed JSON data

**Throws:**
- `Error` - "File not found: {filepath}" if file doesn't exist
- `Error` - "Invalid JSON in file: {filepath}" if JSON is malformed
- `Error` - "Failed to read file: {filepath}" for other read errors

**Example:**
```javascript
const data = await storage.readJSON('./data/highscores/score1.json');
console.log(data.player, data.score);
```

### `writeJSON(filepath, data)`

Writes data to a JSON file with pretty printing (2-space indentation).

**Parameters:**
- `filepath` (string): Absolute or relative path to the JSON file
- `data` (any): Data to serialize and write

**Returns:** `Promise<void>`

**Throws:**
- `Error` - "Failed to write file: {filepath}" if write operation fails

**Features:**
- Automatically creates parent directories if they don't exist
- Pretty-prints JSON for readability
- UTF-8 encoding

**Example:**
```javascript
const highScore = {
  player: 'Alice',
  score: 15000,
  level: 10
};
await storage.writeJSON('./data/highscores/alice.json', highScore);
```

### `ensureDirectory(dirPath)`

Ensures a directory exists, creating it (and parent directories) if necessary.

**Parameters:**
- `dirPath` (string): Absolute or relative path to the directory

**Returns:** `Promise<void>`

**Throws:**
- `Error` - "Failed to create directory: {dirPath}" if creation fails

**Features:**
- Creates nested directories (recursive: true)
- Silently succeeds if directory already exists

**Example:**
```javascript
await storage.ensureDirectory('./data/highscores/2024/october');
```

### `backupFile(filepath)`

Creates a backup copy of a file with `.backup` extension.

**Parameters:**
- `filepath` (string): Absolute or relative path to the file

**Returns:** `Promise<void>`

**Throws:**
- `Error` - "Source file not found: {filepath}" if source doesn't exist
- `Error` - "Failed to backup file: {filepath}" if copy operation fails

**Example:**
```javascript
// Before modifying, create a backup
await storage.backupFile('./data/settings/game-config.json');
// Now safe to modify the original
```

## Usage Patterns

### Pattern 1: Initialize Storage Directories

```javascript
async function initializeApp() {
  const storage = new FileStorageService();
  
  // Ensure all required directories exist
  await storage.ensureDirectory('./data/highscores');
  await storage.ensureDirectory('./data/settings');
  await storage.ensureDirectory('./data/config');
  
  console.log('Storage initialized');
}
```

### Pattern 2: Safe Read with Defaults

```javascript
async function loadSettings() {
  const storage = new FileStorageService();
  const filepath = './data/settings/game.json';
  
  try {
    return await storage.readJSON(filepath);
  } catch (error) {
    if (error.message.includes('File not found')) {
      // Return default settings
      return { difficulty: 'normal', sound: true };
    }
    throw error;
  }
}
```

### Pattern 3: Update with Backup

```javascript
async function updateHighScore(newScore) {
  const storage = new FileStorageService();
  const filepath = './data/highscores/current.json';
  
  try {
    // Backup existing file
    await storage.backupFile(filepath);
    
    // Read current data
    const data = await storage.readJSON(filepath);
    
    // Update
    if (newScore > data.score) {
      data.score = newScore;
      data.timestamp = new Date().toISOString();
      await storage.writeJSON(filepath, data);
    }
  } catch (error) {
    console.error('Failed to update high score:', error);
  }
}
```

### Pattern 4: Batch Operations

```javascript
async function saveAllHighScores(scores) {
  const storage = new FileStorageService();
  
  await storage.ensureDirectory('./data/highscores');
  
  for (const [index, score] of scores.entries()) {
    const filepath = `./data/highscores/score-${index + 1}.json`;
    await storage.writeJSON(filepath, score);
  }
}
```

## Error Handling

The service provides specific error messages to help with debugging:

```javascript
try {
  await storage.readJSON('./missing.json');
} catch (error) {
  // Error: File not found: ./missing.json
}

try {
  await storage.readJSON('./corrupted.json');
} catch (error) {
  // Error: Invalid JSON in file: ./corrupted.json
}

try {
  await storage.writeJSON('/restricted/file.json', {});
} catch (error) {
  // Error: Failed to write file: /restricted/file.json
}
```

## Testing

The service has **100% test coverage** with 14 unit tests covering all scenarios:

```bash
npm test -- tests/unit/services/file-storage.service.test.js
```

Run with coverage report:
```bash
npm test -- tests/unit/services/file-storage.service.test.js --coverage
```

## Best Practices

1. **Always handle errors** - Use try/catch blocks for all operations
2. **Backup before modify** - Use `backupFile()` before updating critical data
3. **Initialize directories** - Call `ensureDirectory()` during app startup
4. **Validate data** - Check data structure before writing
5. **Use absolute paths** - Or ensure consistent working directory

## Performance Considerations

- All operations are asynchronous and non-blocking
- Uses Node.js `fs/promises` for optimal performance
- Pretty-printing adds minimal overhead
- Backup operations are fast file copies

## File Format

All JSON files are formatted with:
- 2-space indentation
- UTF-8 encoding
- Unix line endings (LF)

Example output:
```json
{
  "player": "Alice",
  "score": 15000,
  "level": 10,
  "timestamp": "2024-10-31T12:00:00.000Z"
}
```

## Troubleshooting

**Problem:** "File not found" errors  
**Solution:** Ensure the file exists or use try/catch with defaults

**Problem:** "Invalid JSON" errors  
**Solution:** Check file encoding, fix syntax, or restore from backup

**Problem:** "Failed to write" errors  
**Solution:** Check file permissions and disk space

**Problem:** Directory not created  
**Solution:** Verify parent directory permissions

## License

ISC
