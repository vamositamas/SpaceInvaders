# ConfigService

`src/services/config.service.js`

Manages game configuration with file persistence, deep-merge updates, and validation. Reads from / writes to `data/config/game-config.json`, falling back to `data/config/default-config.json` if the active config is missing or invalid.

---

## Constructor

```js
const ConfigService = require('./src/services/config.service');
const service = new ConfigService();
```

Creates a new instance. Does **not** load config automatically — call `loadConfig()` first.

---

## Methods

### `loadConfig()` → `Promise<GameConfig>`

Loads configuration from `data/config/game-config.json`. Falls back to the default config if the file is missing or fails validation.

```js
const config = await service.loadConfig();
console.log(config.canvas.width); // 800
```

---

### `getConfig()` → `GameConfig`

Returns the in-memory config synchronously. Throws if `loadConfig()` has not been called.

```js
const config = service.getConfig();
```

**Throws:** `Error: Configuration not loaded. Call loadConfig() first.`

---

### `updateConfig(updates)` → `Promise<GameConfig>`

Deep-merges `updates` into the current config, validates the result, and persists to file.

| Parameter | Type | Description |
|-----------|------|-------------|
| `updates` | `Partial<GameConfig>` | Fields to update (nested objects are merged) |

```js
// Lower the fire rate to 300ms
const updated = await service.updateConfig({ player: { fireRate: 300 } });
```

**Throws:**
- `Error: Configuration not loaded.` if `loadConfig()` not called
- Validation errors (e.g. `"Player speed must be a positive number"`)

---

### `resetToDefault()` → `Promise<GameConfig>`

Copies `default-config.json` over `game-config.json` and updates in-memory state.

```js
const defaults = await service.resetToDefault();
```

---

## Validation Rules

All validation uses `src/models/schemas.js`:

| Field | Rule |
|-------|------|
| `canvas.width / height` | Positive number |
| `player.speed` | Positive number |
| `player.fireRate` | Positive number |
| `player.lives` | Positive integer |
| `enemies.rows / columns` | Positive integer |
| `enemies.baseSpeed` | Positive number |
| `enemies.speedIncrement` | Non-negative number |
| `enemies.fireRate` | Positive number |
| `difficulty.*.speedMultiplier` | Positive number |
| `difficulty.*.fireRateMultiplier` | Positive number |

---

## Related

- [Config API](CONFIG_API.md)
- [FileStorageService](FILE_STORAGE_SERVICE.md)
