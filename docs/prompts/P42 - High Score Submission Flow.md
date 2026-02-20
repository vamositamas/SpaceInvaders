### Prompt 6.1: High Score Submission Flow

```
Implement end-to-end high score submission from game to backend.

Requirements:
1. Create /src/app/core/services/highscore-api.service.ts with:
   - getHighScores(limit?: number): Observable<HighScore[]>
   - submitHighScore(score: HighScore): Observable<HighScore>
   - checkIsHighScore(score: number): Observable<boolean>
   - HTTP calls to backend API endpoints
2. Update game-over.component.ts to:
   - Check if score qualifies as high score on load
   - Show name entry form if high score
   - Submit score with player name to API
   - Navigate to high scores after submission
3. Handle API errors gracefully with user feedback

TDD Approach:
- Create highscore-api.service.spec.ts:
  * getHighScores calls GET /api/highscores
  * submitHighScore calls POST /api/highscores with data
  * checkIsHighScore calls API to validate score
  * HTTP errors handled and returned as observables
  * Request headers include content-type
- Update game-over.component.spec.ts:
  * Component checks if score is high score on init
  * Name form shown only for high scores
  * Submit calls API with correct data
  * Success navigates to high scores page
  * Error shows error message to user
- Mock HttpClient with HttpClientTestingModule
- Implement API service and integration

Deliverable: Complete high score submission flow
```
