# P9 - API Service for Backend Communication

Create an Angular service to handle HTTP communication with the Node.js backend API.

## Requirements

1. Create `/src/app/core/services/api.service.ts` with HttpClient
2. Implement methods for all backend endpoints:
   - **Config API:**
     - `getConfig(): Observable<GameConfig>`
     - `updateConfig(config: Partial<GameConfig>): Observable<GameConfig>`
     - `updateConfigProperty(property: string, value: any): Observable<GameConfig>`
     - `resetConfig(): Observable<GameConfig>`
   - **High Score API:**
     - `getHighScores(limit?: number): Observable<HighScore[]>`
     - `addHighScore(score: HighScore): Observable<HighScore>`
     - `getHighScoreById(id: string): Observable<HighScore>`
     - `deleteHighScore(id: string): Observable<void>`
3. Create TypeScript interfaces in `/src/app/core/models/`:
   - `game-config.interface.ts`
   - `high-score.interface.ts`
4. Use environment configuration for API base URL
5. Implement proper error handling with RxJS operators
6. Add retry logic for failed requests (up to 2 retries)

## TDD Approach

### Step 1: Create Test File
- Create `api.service.spec.ts`
- Mock HttpClient using HttpClientTestingModule
- Write tests for:
  * Service creation and injection
  * All GET requests return expected observables
  * All POST/PUT/DELETE requests send correct data
  * Error handling works correctly
  * Retry logic attempts failed requests
  * API URLs are constructed correctly with base URL

### Step 2: Create Models
- Define `GameConfig` interface matching backend schema
- Define `HighScore` interface matching backend schema
- Export interfaces from barrel file

### Step 3: Implement Service
- Inject HttpClient
- Implement all methods using HttpClient
- Add error handling with catchError
- Add retry logic with retry operator
- Use proper TypeScript types
- Make tests pass

### Step 4: Verify
- Run `ng test` and ensure all tests pass
- Check that HttpClient requests are properly mocked
- Verify error handling and retry logic

## Expected Test Results

All tests should pass:
- ✅ Service creates successfully
- ✅ getConfig() calls correct endpoint
- ✅ updateConfig() sends PUT request with data
- ✅ updateConfigProperty() sends POST request
- ✅ resetConfig() calls reset endpoint
- ✅ getHighScores() calls correct endpoint with optional limit
- ✅ addHighScore() sends POST request with score data
- ✅ getHighScoreById() constructs URL with ID
- ✅ deleteHighScore() sends DELETE request
- ✅ Error handling catches HTTP errors
- ✅ Retry logic attempts failed requests

## Deliverable

Working API service with:
- Full unit test coverage (15+ tests)
- All backend endpoints integrated
- Type-safe interfaces
- Error handling and retry logic
- Clean, documented code following Angular best practices
