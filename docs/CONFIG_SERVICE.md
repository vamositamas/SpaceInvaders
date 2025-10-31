# ConfigService Documentation

A robust configuration management service for Space Invaders game settings with validation and persistence.

## Overview

The `ConfigService` provides a reliable interface for managing game configuration with automatic validation, file persistence, and default settings fallback.

## Features

- ✅ **Automatic Persistence** - Saves configuration to disk automatically
- ✅ **Validation** - Comprehensive validation for all configuration values
- ✅ **Default Fallback** - Loads default configuration if file is missing or invalid
- ✅ **Partial Updates** - Merge updates without replacing entire config
- ✅ **Reset Capability** - Restore default settings anytime
- ✅ **Deep Merge** - Nested object updates preserve existing values
- ✅ **100% Test Coverage** - Fully tested with 16 unit tests

## Configuration Structure

```json
{
  "canvas": {
    "width": 800,
    "height": 600
  },
  "player": {
    "speed": 5,
    "fireRate": 500,
    "lives": 3
  },
  "enemies": {
    "rows": 5,
    "columns": 11,
    "baseSpeed": 1,
    "speedIncrement": 0.1,
    "fireRate": 2000
  },
  "difficulty": {
    "easy": {
      "speedMultiplier": 0.75,
      "fireRateMultiplier": 1.5
    },
    "normal": {
      "speedMultiplier": 1.0,
      "fireRateMultiplier": 1.0
    },
    "hard": {
      "speedMultiplier": 1.5,
      "fireRateMultiplier": 0.5
    }
  }
}
```

## Installation

The service is already included in the project. Simply require it:

```javascript
const ConfigService = require('./src/services/config.service');
const configService = new ConfigService();
```

## API Reference

### `loadConfig()`

Loads configuration from file or returns default configuration if file doesn't exist or is invalid.

**Returns:** `Promise<object>` - Configuration object

**Behavior:**
1. Attempts to read saved configuration from disk
2. Validates the loaded configuration
3. If validation fails or file doesn't exist, loads default configuration
4. Stores configuration in memory for fast access

**Example:**
```javascript
const config = await configService.loadConfig();
console.log(`Canvas: ${config.canvas.width}x${config.canvas.height}`);
```

### `getConfig()`

Returns the current in-memory configuration.

**Returns:** `object` - Current configuration (cloned to prevent mutations)

**Throws:**
- `Error` - "Configuration not loaded" if `loadConfig()` hasn't been called

**Example:**
```javascript
const config = configService.getConfig();
console.log('Player lives:', config.player.lives);
```

### `updateConfig(updates)`

Merges partial updates with the current configuration and saves to disk.

**Parameters:**
- `updates` (object): Partial configuration updates

**Returns:** `Promise<object>` - Updated configuration

**Throws:**
- `Error` - "Configuration not loaded" if `loadConfig()` hasn't been called
- `Error` - Validation errors if updates contain invalid values

**Features:**
- Deep merges nested objects
- Validates complete configuration after merge
- Automatically saves to disk
- Updates in-memory configuration

**Example:**
```javascript
// Update only player lives
await configService.updateConfig({
  player: { lives: 5 }
});

// Update multiple sections
await configService.updateConfig({
  canvas: { width: 1024, height: 768 },
  player: { speed: 7 }
});
```

### `resetToDefault()`

Resets configuration to default values and saves to disk.

**Returns:** `Promise<object>` - Default configuration

**Example:**
```javascript
const defaultConfig = await configService.resetToDefault();
console.log('Configuration reset to defaults');
```

## Validation Rules

### Canvas
- `width`: Positive number (pixels)
- `height`: Positive number (pixels)

### Player
- `speed`: Positive number (pixels per frame)
- `fireRate`: Positive number (milliseconds between shots)
- `lives`: Positive integer

### Enemies
- `rows`: Positive integer
- `columns`: Positive integer
- `baseSpeed`: Positive number
- `speedIncrement`: Non-negative number
- `fireRate`: Positive number (milliseconds)

### Difficulty
Each difficulty level (`easy`, `normal`, `hard`) must have:
- `speedMultiplier`: Positive number
- `fireRateMultiplier`: Positive number

## Usage Patterns

### Pattern 1: Application Initialization

```javascript
async function startGame() {
  const configService = new ConfigService();
  
  // Load configuration on startup
  const config = await configService.loadConfig();
  
  // Initialize game with config
  const canvas = createCanvas(config.canvas.width, config.canvas.height);
  const player = createPlayer(config.player);
  const enemies = createEnemies(config.enemies);
  
  console.log('Game initialized with configuration');
}
```

### Pattern 2: Settings Menu

```javascript
async function saveSettings(userSettings) {
  try {
    await configService.updateConfig({
      canvas: {
        width: userSettings.resolution.width,
        height: userSettings.resolution.height
      },
      player: {
        lives: userSettings.lives
      }
    });
    
    alert('Settings saved successfully!');
  } catch (error) {
    alert('Invalid settings: ' + error.message);
  }
}
```

### Pattern 3: Difficulty Selection

```javascript
async function setDifficulty(level) {
  const config = configService.getConfig();
  const difficulty = config.difficulty[level];
  
  if (!difficulty) {
    throw new Error('Invalid difficulty level');
  }
  
  // Apply difficulty multipliers
  await configService.updateConfig({
    enemies: {
      baseSpeed: config.enemies.baseSpeed * difficulty.speedMultiplier,
      fireRate: config.enemies.fireRate * difficulty.fireRateMultiplier
    }
  });
  
  console.log(`Difficulty set to: ${level}`);
}
```

### Pattern 4: Reset Settings

```javascript
async function resetToDefaults() {
  if (confirm('Reset all settings to defaults?')) {
    await configService.resetToDefault();
    console.log('Settings restored to defaults');
    window.location.reload(); // Restart game with new settings
  }
}
```

### Pattern 5: Safe Updates with Validation

```javascript
async function updatePlayerSpeed(speed) {
  try {
    await configService.updateConfig({
      player: { speed: parseFloat(speed) }
    });
    return true;
  } catch (error) {
    if (error.message.includes('positive number')) {
      console.error('Speed must be a positive number');
    } else {
      console.error('Update failed:', error.message);
    }
    return false;
  }
}
```

## Error Handling

The service provides specific validation errors:

```javascript
// Invalid canvas size
await configService.updateConfig({ canvas: { width: -1 } });
// Error: Canvas width must be a positive number

// Invalid player lives
await configService.updateConfig({ player: { lives: 2.5 } });
// Error: Player lives must be a positive integer

// Invalid difficulty multiplier
await configService.updateConfig({ 
  difficulty: { easy: { speedMultiplier: 0 } }
});
// Error: Difficulty level 'easy' speedMultiplier must be a positive number

// Missing required section
await configService.updateConfig({ incomplete: true });
// Error: Configuration section 'canvas' is required (after merge validation)
```

## Files

- **Service**: `/src/services/config.service.js`
- **Validation**: `/src/models/schemas.js`
- **Default Config**: `/data/config/default-config.json`
- **Saved Config**: `/data/config/game-config.json` (created automatically)
- **Tests**: `/tests/unit/services/config.service.test.js`
- **Examples**: `/src/services/config.examples.js`

## Testing

Run config service tests:
```bash
npm test -- tests/unit/services/config.service.test.js
```

Run with coverage:
```bash
npm test -- tests/unit/services/config.service.test.js --coverage
```

**Test Results:**
- ✅ 16 tests passing
- ✅ Covers all methods and error cases
- ✅ Validates partial and complete updates
- ✅ Tests default fallback behavior

## Integration

The ConfigService uses FileStorageService for persistence:

```javascript
// Dependencies
const FileStorageService = require('./file-storage.service');
const { validateConfig } = require('../models/schemas');
```

This ensures:
- Automatic directory creation
- Pretty-printed JSON
- Consistent error handling
- File backup support (via FileStorageService)

## Best Practices

1. **Load Once** - Call `loadConfig()` once during application startup
2. **Use getConfig()** - Access configuration via `getConfig()` throughout app
3. **Validate Early** - Updates fail fast with clear error messages
4. **Partial Updates** - Only specify values you want to change
5. **Handle Errors** - Always wrap updates in try/catch blocks
6. **Reset Option** - Provide users with a "Reset to Defaults" button
7. **Test Changes** - Validate game still works after config changes

## Performance

- **Fast Access**: Configuration cached in memory after load
- **Efficient Updates**: Only saves to disk on updates
- **Small Footprint**: JSON files are compact (~500 bytes)
- **Validation**: O(1) validation for each config section

## Troubleshooting

**Problem:** "Configuration not loaded" error  
**Solution:** Call `loadConfig()` before using other methods

**Problem:** Validation errors on update  
**Solution:** Check that all values are correct types (number, integer, etc.)

**Problem:** Updates not persisting  
**Solution:** Ensure write permissions on `/data/config/` directory

**Problem:** Invalid config file  
**Solution:** Delete `game-config.json` to regenerate from defaults

## Future Enhancements

Potential features for future versions:
- Configuration versioning and migration
- User profiles with per-profile settings
- Keyboard/controller mapping configuration
- Audio settings (volume, sound effects)
- Visual settings (themes, particle effects)
- Network settings (multiplayer)

## License

ISC
