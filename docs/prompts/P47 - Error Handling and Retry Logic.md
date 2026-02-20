### Prompt 6.6: Error Handling and Retry Logic

```
Add comprehensive error handling and retry logic for API calls.

Requirements:
1. Create /src/app/core/services/error-handler.service.ts with:
   - handleError(error: any): Observable<never> - processes HTTP errors
   - showErrorMessage(message: string): void - displays to user
   - logError(error: any): void - logs for debugging
2. Create /src/middleware/error-handler.js (backend) with:
   - Global error handler middleware
   - Error formatting for consistent responses
   - Error logging with stack traces
3. Add retry logic with exponential backoff for API calls
4. Display user-friendly error messages

TDD Approach:
- Create error-handler.service.spec.ts:
  * handleError converts HTTP errors to user messages
  * 404 errors show "not found" message
  * 500 errors show "server error" message
  * Network errors show "connection failed" message
  * Errors logged to console in dev mode
- Create error-handler.test.js:
  * Middleware catches all errors
  * Errors formatted with status and message
  * Stack traces included in development
  * Stack traces excluded in production
- Implement error handling
- Add retry operators to HTTP calls

Deliverable: Robust error handling across app
```
