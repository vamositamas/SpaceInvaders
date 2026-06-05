# Config API

REST API for managing game configuration. All endpoints are under `/api/config`.

---

## Endpoints

### GET /api/config

Returns the current active game configuration.

**Response 200:**
```json
{
  "canvas": { "width": 800, "height": 650 },
  "player": { "speed": 5, "fireRate": 500, "lives": 3 },
  "enemies": {
    "rows": 5,
    "columns": 11,
    "baseSpeed": 1,
    "speedIncrement": 0.1,
    "fireRate": 2000
  },
  "difficulty": {
    "easy":   { "speedMultiplier": 0.75, "fireRateMultiplier": 1.5 },
    "normal": { "speedMultiplier": 1.0,  "fireRateMultiplier": 1.0 },
    "hard":   { "speedMultiplier": 1.5,  "fireRateMultiplier": 0.5 }
  }
}
```

**Example:**
```bash
curl http://localhost:3000/api/config
```

---

### PUT /api/config

Updates the configuration with a partial or full update. Deep-merges with the current config.

**Request body:** partial or full `GameConfig` object  
**Content-Type:** `application/json`

**Example — update only canvas height:**
```bash
curl -X PUT http://localhost:3000/api/config \
  -H "Content-Type: application/json" \
  -d '{ "canvas": { "height": 700 } }'
```

**Example — update player fire rate:**
```bash
curl -X PUT http://localhost:3000/api/config \
  -H "Content-Type: application/json" \
  -d '{ "player": { "fireRate": 300 } }'
```

**Response 200:** Updated full config object.

**Error responses:**
| Code | Reason |
|------|--------|
| 400 | Body is empty |
| 400 | Validation failure (e.g. `"Player speed must be a positive number"`) |
| 500 | File write error |

---

### POST /api/config/reset

Resets the active configuration back to the values in `data/config/default-config.json`.

**Request body:** none

**Example:**
```bash
curl -X POST http://localhost:3000/api/config/reset
```

**Response 200:** Default config object.

---

## Data Model

### GameConfig

| Field | Type | Constraints |
|-------|------|-------------|
| `canvas.width` | number | > 0 |
| `canvas.height` | number | > 0 |
| `player.speed` | number | > 0 |
| `player.fireRate` | number | > 0 (milliseconds between shots) |
| `player.lives` | integer | > 0 |
| `enemies.rows` | integer | > 0 |
| `enemies.columns` | integer | > 0 |
| `enemies.baseSpeed` | number | > 0 |
| `enemies.speedIncrement` | number | >= 0 |
| `enemies.fireRate` | number | > 0 (ms between enemy shots) |
| `difficulty.easy.speedMultiplier` | number | > 0 |
| `difficulty.easy.fireRateMultiplier` | number | > 0 |
| `difficulty.normal.*` | number | > 0 |
| `difficulty.hard.*` | number | > 0 |

---

## Error Format

```json
{ "error": "Player lives must be a positive integer" }
```

---

## Related

- [ConfigService](CONFIG_SERVICE.md)
- [High Score API](HIGHSCORE_API.md)
