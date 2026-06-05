# FileStorageService

`src/services/file-storage.service.js`

Utility service for reading and writing JSON files, with automatic directory creation and backup support. Used internally by `ConfigService` and `HighScoreService`.

---

## Constructor

```js
const FileStorageService = require('./src/services/file-storage.service');
const storage = new FileStorageService();
```

Stateless — no initialisation needed.

---

## Methods

### `readJSON(filepath)` → `Promise<any>`

Reads and parses a JSON file.

| Parameter | Type | Description |
|-----------|------|-------------|
| `filepath` | string | Absolute path to the JSON file |

```js
const data = await storage.readJSON('/path/to/data.json');
```

**Throws:**
- `Error: File not found: <path>` — file does not exist
- `Error: Invalid JSON in file: <path>` — file is not valid JSON
- `Error: Failed to read file: <path>` — other I/O error

---

### `writeJSON(filepath, data)` → `Promise<void>`

Serialises `data` to formatted JSON and writes it to disk. Creates parent directories automatically if they don't exist.

| Parameter | Type | Description |
|-----------|------|-------------|
| `filepath` | string | Absolute path to write to |
| `data` | any | Any JSON-serialisable value |

```js
await storage.writeJSON('/path/to/output.json', { score: 9000 });
```

**Throws:** `Error: Failed to write file: <path>`

---

### `ensureDirectory(dirPath)` → `Promise<void>`

Creates a directory (and any missing parents) if it does not exist. Safe to call when the directory already exists.

| Parameter | Type | Description |
|-----------|------|-------------|
| `dirPath` | string | Absolute path to the directory |

```js
await storage.ensureDirectory('/path/to/new/dir');
```

**Throws:** `Error: Failed to create directory: <path>`

---

### `backupFile(filepath)` → `Promise<void>`

Creates a `.backup` copy of a file at `<filepath>.backup`.

| Parameter | Type | Description |
|-----------|------|-------------|
| `filepath` | string | Absolute path to the source file |

```js
await storage.backupFile('/path/to/game-config.json');
// Creates /path/to/game-config.json.backup
```

**Throws:**
- `Error: Source file not found: <path>` — source does not exist
- `Error: Failed to backup file: <path>` — copy failed

---

## Test Coverage

14 unit tests — 100% coverage.

```bash
npm test -- tests/unit/services/file-storage.service.test.js
```

---

## Related

- [ConfigService](CONFIG_SERVICE.md)
- [HighScoreService](HIGHSCORE_SERVICE.md)
