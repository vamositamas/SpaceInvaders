# HighScoreService

`src/services/highscore.service.js`

Manages high score persistence, validation, sorting, and the top-100 cap. Reads and writes `data/highscores/highscores.json` via `FileStorageService`.

---

## Constructor

```js
const HighScoreService = require('./src/services/highscore.service');
const service = new HighScoreService();
```

---

## Methods

### `getAllHighScores()` → `Promise<HighScore[]>`

Returns all stored scores sorted by score descending.

```js
const scores = await service.getAllHighScores();
```

---

### `getTopScores(limit)` → `Promise<HighScore[]>`

Returns the top `limit` scores.

| Parameter | Type | Description |
|-----------|------|-------------|
| `limit` | number | Maximum number of scores to return |

```js
const top10 = await service.getTopScores(10);
```

---

### `addHighScore(scoreData)` → `Promise<HighScore>`

Validates, stores, and returns a new high score. Trims the list to 100 after insertion.

| Parameter | Type | Required | Constraints |
|-----------|------|----------|-------------|
| `scoreData.playerName` | string | Yes | 1–20 characters |
| `scoreData.score` | number | Yes | >= 0 |
| `scoreData.level` | integer | Yes | >= 1 |
| `scoreData.duration` | number | No | >= 0 |

```js
const newScore = await service.addHighScore({
  playerName: 'Alice',
  score: 9500,
  level: 12,
  duration: 420
});
// Returns: { id, playerName, score, level, date, duration }
```

**Throws** validation errors from `src/models/schemas.js`.

---

### `isHighScore(score)` → `Promise<boolean>`

Returns `true` if the score would make it into the top 100 (i.e. the list has fewer than 100 entries, or `score` is >= the current 100th score).

```js
if (await service.isHighScore(5000)) {
  // prompt player for their name
}
```

---

### `getScoreById(id)` → `Promise<HighScore | null>`

Returns a score by UUID, or `null` if not found.

```js
const score = await service.getScoreById('550e8400-...');
```

---

### `deleteScore(id)` → `Promise<boolean>`

Deletes a score by UUID. Returns `true` if deleted, `false` if not found.

```js
const deleted = await service.deleteScore('550e8400-...');
```

---

### `clearAllScores()` → `Promise<void>`

Removes all scores. Intended for testing only.

---

## Storage Format

`data/highscores/highscores.json`:
```json
{
  "scores": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "playerName": "Alice",
      "score": 9500,
      "level": 12,
      "date": "2026-02-20T14:00:00.000Z",
      "duration": 420
    }
  ]
}
```

---

## Business Rules

- Cap: top **100** scores kept. On the 101st insert the lowest is dropped.
- IDs are generated with Node's built-in `crypto.randomUUID()`.
- `date` is always set to `new Date().toISOString()` on creation.

---

## Test Coverage

17 unit tests — 97%+ coverage.

```bash
npm test -- tests/unit/services/highscore.service.test.js
```

---

## Related

- [High Score API](HIGHSCORE_API.md)
- [FileStorageService](FILE_STORAGE_SERVICE.md)
