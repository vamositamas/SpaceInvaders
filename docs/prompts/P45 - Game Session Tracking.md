### Prompt 6.4: Game Session Tracking

```
Add game session tracking for analytics and debugging.

Requirements:
1. Create /src/services/session.service.js (backend) with:
   - createSession(playerId): Session - starts new game session
   - updateSession(sessionId, gameState): Session - updates progress
   - endSession(sessionId, finalScore): Session - completes session
   - getSessionStats(): SessionStats - returns aggregate statistics
2. Create /data/logs/game-sessions.json for session storage
3. Track: start time, end time, final score, level reached, duration
4. Auto-cleanup old sessions (keep last 100)

TDD Approach:
- Create session.service.test.js:
  * createSession generates unique session ID
  * createSession stores start timestamp
  * updateSession appends state updates
  * endSession marks session complete
  * endSession calculates total duration
  * getSessionStats returns averages and totals
  * Old sessions automatically removed when limit exceeded
- Implement session tracking service
- Use file-storage.service for persistence
- Verify data integrity

Deliverable: Game session tracking and analytics
```
