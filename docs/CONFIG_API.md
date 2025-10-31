# Config API Documentation

REST API endpoints for managing game configuration in the Space Invaders backend.

## Overview

The Config API provides endpoints to retrieve, update, and reset game configuration settings with validation and error handling.

## Base URL

```
http://localhost:3000/api/config
```

## Authentication

Currently, no authentication is required. (Future enhancement)

## Endpoints

### GET /api/config

Retrieves the current game configuration.

**Request:**
```http
GET /api/config HTTP/1.1
Host: localhost:3000
```

**Response (200 OK):**
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

**Example (cURL):**
```bash
curl http://localhost:3000/api/config
```

**Example (JavaScript):**
```javascript
const response = await fetch('http://localhost:3000/api/config');
const config = await response.json();
console.log(config);
```

---

### PUT /api/config

Updates the game configuration with partial or complete updates.

**Request:**
```http
PUT /api/config HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "player": {
    "lives": 5
  }
}
```

**Request Body:**
- Partial configuration object
- All fields are optional
- Nested objects are deep merged
- Values must pass validation

**Response (200 OK):**
```json
{
  "canvas": {
    "width": 800,
    "height": 600
  },
  "player": {
    "speed": 5,
    "fireRate": 500,
    "lives": 5
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

**Response (400 Bad Request):**
```json
{
  "error": "Player lives must be a positive integer"
}
```

**Validation Rules:**
- Canvas width/height: Positive numbers
- Player speed/fireRate: Positive numbers
- Player lives: Positive integer
- Enemy rows/columns: Positive integers
- Enemy speeds: Positive numbers
- Difficulty multipliers: Positive numbers

**Example (cURL):**
```bash
curl -X PUT http://localhost:3000/api/config \
  -H "Content-Type: application/json" \
  -d '{"player": {"lives": 5}}'
```

**Example (JavaScript):**
```javascript
const response = await fetch('http://localhost:3000/api/config', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    player: { lives: 5 },
    canvas: { width: 1024 }
  })
});

const updatedConfig = await response.json();
console.log(updatedConfig);
```

---

### POST /api/config/reset

Resets the configuration to default values.

**Request:**
```http
POST /api/config/reset HTTP/1.1
Host: localhost:3000
```

**Response (200 OK):**
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

**Example (cURL):**
```bash
curl -X POST http://localhost:3000/api/config/reset
```

**Example (JavaScript):**
```javascript
const response = await fetch('http://localhost:3000/api/config/reset', {
  method: 'POST'
});

const defaultConfig = await response.json();
console.log('Configuration reset to defaults');
```

---

## Error Responses

### 400 Bad Request

Returned when validation fails or request is malformed.

**Example - Invalid Value:**
```json
{
  "error": "Player lives must be a positive integer"
}
```

**Example - Empty Body:**
```json
{
  "error": "Request body cannot be empty"
}
```

**Example - Invalid JSON:**
```json
{
  "error": "Invalid JSON"
}
```

### 404 Not Found

Returned when the requested endpoint doesn't exist.

```json
{
  "error": "Not Found"
}
```

### 500 Internal Server Error

Returned when an unexpected server error occurs.

```json
{
  "error": "Internal Server Error"
}
```

---

## Usage Examples

### Example 1: Get Current Config

```javascript
async function getCurrentConfig() {
  try {
    const response = await fetch('http://localhost:3000/api/config');
    const config = await response.json();
    return config;
  } catch (error) {
    console.error('Failed to get config:', error);
  }
}
```

### Example 2: Update Player Settings

```javascript
async function updatePlayerLives(lives) {
  try {
    const response = await fetch('http://localhost:3000/api/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ player: { lives } })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }

    const config = await response.json();
    console.log('Updated player lives to:', config.player.lives);
    return config;
  } catch (error) {
    console.error('Update failed:', error.message);
  }
}
```

### Example 3: Update Multiple Settings

```javascript
async function adjustDifficulty(difficulty) {
  const updates = {
    canvas: { width: 1024, height: 768 },
    player: { speed: 7 },
    enemies: { baseSpeed: 1.5 }
  };

  try {
    const response = await fetch('http://localhost:3000/api/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });

    const config = await response.json();
    return config;
  } catch (error) {
    console.error('Failed to adjust difficulty:', error);
  }
}
```

### Example 4: Reset to Defaults

```javascript
async function resetToDefaults() {
  try {
    const response = await fetch('http://localhost:3000/api/config/reset', {
      method: 'POST'
    });

    const config = await response.json();
    console.log('Configuration reset successfully');
    return config;
  } catch (error) {
    console.error('Reset failed:', error);
  }
}
```

### Example 5: Error Handling

```javascript
async function updateConfigSafely(updates) {
  try {
    const response = await fetch('http://localhost:3000/api/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });

    if (!response.ok) {
      const errorData = await response.json();
      
      if (response.status === 400) {
        console.error('Validation error:', errorData.error);
        // Show user-friendly error message
        alert('Invalid settings: ' + errorData.error);
      } else {
        console.error('Server error:', errorData.error);
      }
      
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Network error:', error);
    alert('Could not connect to server');
    return null;
  }
}
```

---

## Testing

The API has comprehensive integration tests covering all endpoints and error scenarios.

**Run tests:**
```bash
npm test -- tests/integration/config.routes.test.js
```

**Test coverage:**
- ✅ GET endpoint returns correct configuration
- ✅ PUT endpoint updates configuration correctly
- ✅ PUT endpoint validates input data
- ✅ PUT endpoint rejects invalid data
- ✅ POST /reset restores defaults
- ✅ Error handling for 400, 404, 500 errors
- ✅ JSON content-type headers

---

## CORS Configuration

CORS is enabled and configured via environment variables:

```env
ALLOWED_ORIGINS=http://localhost:4200
```

For multiple origins, update the CORS configuration in `server.js`.

---

## Rate Limiting

Currently, no rate limiting is implemented. Consider adding rate limiting middleware for production:

```bash
npm install express-rate-limit
```

---

## Future Enhancements

- [ ] Authentication and authorization
- [ ] Rate limiting
- [ ] Request logging
- [ ] API versioning (v1, v2)
- [ ] WebSocket support for real-time config updates
- [ ] Config history/audit log
- [ ] Batch config operations
- [ ] Config presets/profiles

---

## Related Documentation

- [ConfigService Documentation](./CONFIG_SERVICE.md)
- [Validation Schemas](../src/models/schemas.js)
- [Server Configuration](../server.js)

## License

ISC
