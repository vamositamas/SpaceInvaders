# Services

This directory contains reusable business logic services for the Space Invaders backend.

## Available Services

### ConfigService

A robust configuration management service for game settings with validation and persistence.

**Location:** `config.service.js`

**Features:**
- ✅ Load/save game configuration
- ✅ Comprehensive validation
- ✅ Default settings fallback
- ✅ Partial updates with deep merge
- ✅ Reset to defaults
- ✅ 100% test coverage

**Quick Start:**
```javascript
const ConfigService = require('./config.service');
const config = new ConfigService();

// Load configuration
await config.loadConfig();

// Get current config
const settings = config.getConfig();

// Update settings
await config.updateConfig({ player: { lives: 5 } });

// Reset to defaults
await config.resetToDefault();
```

**Documentation:** See [CONFIG_SERVICE.md](../../docs/CONFIG_SERVICE.md)

**Examples:** See `config.examples.js`

**Tests:** `../../tests/unit/services/config.service.test.js` (16 tests, 100% coverage)

---

### FileStorageService

A robust, fully-tested service for managing JSON file storage operations.

**Location:** `file-storage.service.js`

**Features:**
- ✅ Read and parse JSON files
- ✅ Write JSON with pretty printing
- ✅ Automatic directory creation
- ✅ File backup functionality
- ✅ Comprehensive error handling
- ✅ 100% test coverage

**Quick Start:**
```javascript
const FileStorageService = require('./file-storage.service');
const storage = new FileStorageService();

// Write JSON
await storage.writeJSON('./data/score.json', { score: 1000 });

// Read JSON
const data = await storage.readJSON('./data/score.json');

// Backup file
await storage.backupFile('./data/score.json');
```

**Documentation:** See [FILE_STORAGE_SERVICE.md](../../docs/FILE_STORAGE_SERVICE.md)

**Examples:** See `file-storage.examples.js`

**Tests:** `../../tests/unit/services/file-storage.service.test.js` (14 tests, 100% coverage)

## Testing

Run all service tests:
```bash
npm test -- tests/unit/services/
```

Run with coverage:
```bash
npm test -- tests/unit/services/ --coverage
```

## Adding New Services

When creating a new service:

1. Create the service file in this directory
2. Write comprehensive tests first (TDD approach)
3. Implement the service to pass all tests
4. Document the API and usage
5. Add examples if complex
6. Aim for 100% test coverage

## Best Practices

- Keep services focused on a single responsibility
- Use async/await for asynchronous operations
- Handle errors gracefully with descriptive messages
- Add JSDoc comments for IDE support
- Export classes or factory functions
- Mock external dependencies in tests
