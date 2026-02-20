### Prompt 6.3: Backend Score Validation

```
Add server-side validation and anti-cheat for high scores.

Requirements:
1. Update /src/services/validation.service.js (backend) with:
   - validateHighScore(score, level, duration): boolean
   - checkScoreRealistic(score, level): boolean - score not impossibly high
   - checkDurationRealistic(duration, level): boolean - time not too short
   - sanitizePlayerName(name): string - remove invalid characters
2. Update highscore.controller.js to:
   - Validate all incoming score submissions
   - Reject invalid or suspicious scores with 400 error
   - Sanitize player name before saving
   - Rate limit score submissions per IP

TDD Approach:
- Create validation.service.test.js:
  * validateHighScore accepts valid scores
  * checkScoreRealistic rejects impossibly high scores
  * checkScoreRealistic accepts reasonable scores for level
  * checkDurationRealistic rejects too-fast completions
  * sanitizePlayerName removes SQL injection attempts
  * sanitizePlayerName removes XSS attempts
  * sanitizePlayerName trims to max length
- Update highscore.controller.test.js:
  * POST rejects scores exceeding level maximum
  * POST rejects names with invalid characters
  * POST accepts valid scores
  * Rate limiting blocks excessive submissions
- Implement validation logic
- Add rate limiting middleware

Deliverable: Secure high score submission with validation
```
