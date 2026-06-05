# High Score API

REST API for managing player high scores. All endpoints are under `/api/highscores`.

---

## Endpoints

### GET /api/highscores

Returns all high scores sorted by score descending.

**Query parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | number | No | Max scores to return (positive integer) |

**Response 200:**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "playerName": "Alice",
    "score": 9500,
    "level": 12,
    "date": "2026-02-20T14:00:00.000Z",
    "duration": 420
  }
]
```

**Error 400:** `{ "error": "Invalid limit parameter. Must be a valid number." }`

**Examples:**
```bash
curl http://localhost:3000/api/highscores
curl http://localhost:3000/api/highscores?limit=10
```

---

### POST /api/highscores

Submits a new high score.

**Request body:**

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `playerName` | string | Yes | 1–20 characters |
| `score` | number | Yes | >= 0 |
| `level` | integer | Yes | >= 1 |
| `duration` | number | No | >= 0 (seconds) |

```json
{
  "playerName": "Alice",
  "score": 9500,
  "level": 12,
  "duration": 420
}
```

**Response 201:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "playerName": "Alice",
  "score": 9500,
  "level": 12,
  "date": "2026-02-20T14:00:00.000Z",
  "duration": 420
}
```

**Error responses:**

| Code | Message |
|------|---------|
| 400 | `Missing required fields: playerName, score, and level are required.` |
| 400 | `Player name must be between 1 and 20 characters` |
| 400 | `Score must be a non-negative number` |
| 400 | `Level must be an integer >= 1` |

**Example:**
```bash
curl -X POST http://localhost:3000/api/highscores \
  -H "Content-Type: application/json" \
  -d '{ "playerName": "Alice", "score": 9500, "level": 12 }'
```

---

### GET /api/highscores/:id

Gets a specific high score by UUID.

**Response 200:** High score object (same shape as POST response).

**Error 404:** `{ "error": "High score with id '<id>' not found." }`

**Example:**
```bash
curl http://localhost:3000/api/highscores/550e8400-e29b-41d4-a716-446655440000
```

---

### DELETE /api/highscores/:id

Deletes a high score by UUID.

**Response 204:** No content.

**Error 404:** `{ "error": "High score with id '<id>' not found." }`

**Example:**
```bash
curl -X DELETE http://localhost:3000/api/highscores/550e8400-e29b-41d4-a716-446655440000
```

---

## Data Model

### HighScore Object

| Field | Type | Description |
|-------|------|-------------|
| `id` | string (UUID) | Auto-generated unique identifier |
| `playerName` | string | 1–20 characters |
| `score` | number | Non-negative |
| `level` | integer | >= 1 |
| `date` | string (ISO 8601) | Auto-set at creation time |
| `duration` | number (optional) | Game duration in seconds |

---

## Business Rules

- Maximum **100 scores** are persisted. When the 101st is added, the lowest score is dropped.
- All GET responses are sorted by score descending.
- Duplicate scores from the same player are allowed (separate sessions).

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 204 | Deleted (no content) |
| 400 | Validation error |
| 404 | Not found |
| 500 | Server error |

---

## Related

- [HighScoreService](HIGHSCORE_SERVICE.md)
- [Config API](CONFIG_API.md)
