# High Score API Documentation

## Overview

The High Score API provides RESTful endpoints for managing player high scores in the Space Invaders game. All endpoints return JSON responses and follow REST conventions.

**Base URL:** `/api/highscores`

---

## Endpoints

### 1. Get All High Scores

Retrieves all high scores sorted by score in descending order (highest first).

**Endpoint:** `GET /api/highscores`

**Query Parameters:**
- `limit` (optional): Number - Maximum number of scores to return
  - Must be a positive integer
  - If not specified, returns all scores

**Success Response:**
- **Code:** 200 OK
- **Content:** Array of high score objects

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "playerName": "Alice",
    "score": 5000,
    "level": 15,
    "date": "2025-11-14T12:00:00.000Z"
  },
  {
    "id": "650e8400-e29b-41d4-a716-446655440001",
    "playerName": "Bob",
    "score": 3500,
    "level": 12,
    "date": "2025-11-14T11:30:00.000Z",
    "duration": 1800
  }
]
```

**Error Responses:**

- **Code:** 400 Bad Request
- **Content:** `{ "error": "Invalid limit parameter. Must be a valid number." }`

**Examples:**

```bash
# Get all high scores
curl http://localhost:3000/api/highscores

# Get top 10 high scores
curl http://localhost:3000/api/highscores?limit=10

# Get top 5 high scores
curl http://localhost:3000/api/highscores?limit=5
```

---

### 2. Create High Score

Submits a new high score to the leaderboard.

**Endpoint:** `POST /api/highscores`

**Request Headers:**
- `Content-Type: application/json`

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `playerName` | String | Yes | Player's name (1-20 characters) |
| `score` | Number | Yes | Score achieved (>= 0) |
| `level` | Number | Yes | Level reached (>= 1) |
| `duration` | Number | No | Game duration in seconds |

```json
{
  "playerName": "Charlie",
  "score": 7500,
  "level": 20,
  "duration": 3600
}
```

**Success Response:**
- **Code:** 201 Created
- **Content:** Created high score object with generated ID and timestamp

```json
{
  "id": "750e8400-e29b-41d4-a716-446655440002",
  "playerName": "Charlie",
  "score": 7500,
  "level": 20,
  "date": "2025-11-14T14:21:50.327Z",
  "duration": 3600
}
```

**Error Responses:**

1. **Missing Required Fields**
   - **Code:** 400 Bad Request
   - **Content:** `{ "error": "Missing required fields: playerName, score, and level are required." }`

2. **Invalid Player Name**
   - **Code:** 400 Bad Request
   - **Content:** `{ "error": "Player name must be between 1 and 20 characters" }`

3. **Invalid Score**
   - **Code:** 400 Bad Request
   - **Content:** `{ "error": "Score must be a non-negative number" }`

4. **Invalid Level**
   - **Code:** 400 Bad Request
   - **Content:** `{ "error": "Level must be at least 1" }`

**Examples:**

```bash
# Submit a new high score
curl -X POST http://localhost:3000/api/highscores \
  -H "Content-Type: application/json" \
  -d '{
    "playerName": "Charlie",
    "score": 7500,
    "level": 20
  }'

# Submit with duration
curl -X POST http://localhost:3000/api/highscores \
  -H "Content-Type: application/json" \
  -d '{
    "playerName": "Diana",
    "score": 9000,
    "level": 25,
    "duration": 4200
  }'
```

---

### 3. Get High Score by ID

Retrieves a specific high score by its unique identifier.

**Endpoint:** `GET /api/highscores/:id`

**URL Parameters:**
- `id`: String - Unique identifier of the high score (UUID format)

**Success Response:**
- **Code:** 200 OK
- **Content:** High score object

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "playerName": "Alice",
  "score": 5000,
  "level": 15,
  "date": "2025-11-14T12:00:00.000Z"
}
```

**Error Responses:**

- **Code:** 404 Not Found
- **Content:** `{ "error": "High score with id '550e8400-e29b-41d4-a716-446655440000' not found." }`

**Examples:**

```bash
# Get specific high score
curl http://localhost:3000/api/highscores/550e8400-e29b-41d4-a716-446655440000
```

---

### 4. Delete High Score

Removes a high score from the leaderboard.

**Endpoint:** `DELETE /api/highscores/:id`

**URL Parameters:**
- `id`: String - Unique identifier of the high score to delete (UUID format)

**Success Response:**
- **Code:** 204 No Content
- **Content:** Empty

**Error Responses:**

- **Code:** 404 Not Found
- **Content:** `{ "error": "High score with id '550e8400-e29b-41d4-a716-446655440000' not found." }`

**Examples:**

```bash
# Delete a high score
curl -X DELETE http://localhost:3000/api/highscores/550e8400-e29b-41d4-a716-446655440000
```

---

## Data Model

### High Score Object

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (UUID) | Unique identifier, auto-generated |
| `playerName` | String | Player's name (1-20 characters) |
| `score` | Number | Score achieved (non-negative) |
| `level` | Number | Level reached (>= 1) |
| `date` | String (ISO 8601) | Timestamp when score was recorded |
| `duration` | Number (optional) | Game duration in seconds |

---

## Business Rules

### Score Validation
- **Player Name:** 1-20 characters, required
- **Score:** Non-negative number, required
- **Level:** Must be at least 1, required
- **Duration:** Optional, must be non-negative if provided

### Score Storage
- Maximum of 100 high scores are maintained
- Scores are automatically sorted by score value (descending)
- When the 101st score is added, the lowest score is removed
- Duplicate scores from the same player are allowed (separate game sessions)

### Sorting
- All GET requests return scores sorted by score in descending order
- Ties are maintained in the order they were received

---

## Error Handling

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - High score successfully created |
| 204 | No Content - High score successfully deleted |
| 400 | Bad Request - Invalid input data |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error occurred |

### Error Response Format

All error responses follow this format:

```json
{
  "error": "Error message describing what went wrong"
}
```

---

## Usage Examples

### Complete Workflow Example

```bash
# 1. Submit a new high score
curl -X POST http://localhost:3000/api/highscores \
  -H "Content-Type: application/json" \
  -d '{
    "playerName": "Eve",
    "score": 12000,
    "level": 30,
    "duration": 5400
  }'

# Response: { "id": "abc123...", "playerName": "Eve", "score": 12000, ... }

# 2. Get top 10 high scores
curl http://localhost:3000/api/highscores?limit=10

# 3. Get specific score by ID
curl http://localhost:3000/api/highscores/abc123...

# 4. Delete a score
curl -X DELETE http://localhost:3000/api/highscores/abc123...
```

### JavaScript/Fetch Example

```javascript
// Submit a new high score
async function submitScore(playerName, score, level) {
  const response = await fetch('http://localhost:3000/api/highscores', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      playerName,
      score,
      level,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  return await response.json();
}

// Get top scores
async function getTopScores(limit = 10) {
  const response = await fetch(
    `http://localhost:3000/api/highscores?limit=${limit}`
  );
  return await response.json();
}

// Usage
try {
  const newScore = await submitScore('Frank', 15000, 35);
  console.log('Score submitted:', newScore);

  const topScores = await getTopScores(5);
  console.log('Top 5 scores:', topScores);
} catch (error) {
  console.error('Error:', error.message);
}
```

---

## Integration with Game Client

### When to Submit Scores

Submit a high score when:
1. Player completes a game session (win or lose)
2. Score is greater than 0
3. Player has entered a valid name

### Recommended Flow

1. **Game Over:**
   - Display final score to player
   - Prompt for player name
   - Validate name (1-20 characters)

2. **Check if Qualifying:**
   - Optionally call GET `/api/highscores?limit=100` to check if score qualifies
   - If fewer than 100 scores exist, any score qualifies
   - If 100 scores exist, check if player's score >= 100th score

3. **Submit Score:**
   - POST to `/api/highscores` with player data
   - Handle success/error responses
   - Display confirmation to player

4. **Display Leaderboard:**
   - GET `/api/highscores?limit=10` for top 10
   - Highlight player's new score if in top 10
   - Show player's rank

---

## Testing

The High Score API includes comprehensive test coverage:

- **18 integration tests** covering all endpoints and scenarios
- **17 unit tests** for the high score service
- Test coverage: 97%+ across all high score components

### Running Tests

```bash
# Run all tests
npm test

# Run only high score API tests
npm test -- tests/integration/highscore.routes.test.js

# Run only high score service tests
npm test -- tests/unit/services/highscore.service.test.js
```

---

## Performance Considerations

- **Limit Parameter:** Use the `limit` parameter when you don't need all scores to reduce response size
- **File Storage:** High scores are persisted to JSON file; consider database migration for high-volume applications
- **Sorting:** Scores are sorted on every read; cached/indexed solutions recommended for production
- **Concurrency:** Current implementation may have race conditions under high concurrent writes; implement locking for production use

---

## Related Documentation

- [HighScore Service Documentation](./HIGHSCORE_SERVICE.md)
- [File Storage Service Documentation](./FILE_STORAGE_SERVICE.md)
- [Config API Documentation](./CONFIG_API.md)
- [Test Results Summary](./TEST_RESULTS.md)

---

*Last Updated: November 14, 2025*  
*API Version: 1.0*
