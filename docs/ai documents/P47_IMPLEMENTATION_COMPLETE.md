# P47 — Error Handling & Retry Logic: Implementation Complete

## Summary

P47 adds comprehensive, centralised error handling across both the Angular frontend and the Node.js backend.

---

## What Was Implemented

### Backend (`src/middleware/validation.js`)

Enhanced the existing `errorHandler` middleware:

| Change | Detail |
|--------|--------|
| Structured response | Always returns `{ error, statusCode }` |
| Dev-only stack traces | `stack` field included when `NODE_ENV !== 'production'` |
| Status code pass-through | Uses `err.statusCode` if set, otherwise falls back to `500` |

### Frontend (`src/app/core/services/error-handler.service.ts`)

New `ErrorHandlerService` with:

| Method | Behaviour |
|--------|-----------|
| `handleError(error)` | Maps HTTP status → friendly message, shows snackbar, logs, re-throws |
| `showErrorMessage(message)` | Opens `MatSnackBar` with 5 s duration and a "Close" action |
| `logError(error)` | `console.error` only when `IS_PRODUCTION === false` |

**Status code → message mapping:**

| Status | User message |
|--------|-------------|
| 0 | "Could not connect to the server. Check your connection." |
| 400 | "Bad request. Please check your input." |
| 401 | "Unauthorized. Please log in." |
| 403 | "Access denied." |
| 404 | "Resource not found." |
| 5xx / other | "A server error occurred. Please try again." |

### ApiService wiring

Replaced the private `handleError` method with delegation to `ErrorHandlerService`:

```typescript
// Before
catchError(this.handleError)

// After  
catchError(err => this.errorHandler.handleError(err))
```

All 11 API method pipelines now use the centralised handler, gaining:
- User-visible snackbar errors
- Dev-only console logging
- Consistent re-throw for downstream `catchError` blocks

### `IS_PRODUCTION` injection token

```typescript
export const IS_PRODUCTION = new InjectionToken<boolean>('IS_PRODUCTION', {
  factory: () => environment.production,
});
```

Allows tests to override the production flag cleanly without modifying the environment file.

---

## Test Coverage

### Backend (`tests/unit/middleware/error-handler.test.js`) — **9 new tests**

- `errorHandler` returns 500 by default
- Uses `err.statusCode` when provided
- Response always contains `error` and `statusCode` fields
- Stack trace omitted in production
- Stack trace included in development
- Stack trace included in test environment
- `handleJsonError` catches `SyntaxError` (400 + body)
- `handleJsonError` passes non-JSON errors to `next`
- `notFoundHandler` returns 404

### Frontend (`error-handler.service.spec.ts`) — **14 new tests**

- Service creation
- `handleError` returns an Observable<never>
- 404, 500, 0, 401, 403, 400 each produce the correct user message
- `handleError` calls `logError`
- `showErrorMessage` opens snackbar with correct message, action label, and duration
- `logError` calls `console.error` in dev, not in prod
- `logError` passes the error to `console.error`

### Fixes applied (`config.service.spec.ts`, `highscore.service.spec.ts`)

Removed `setTimeout` wrappers around synchronous `of()` assertions — was causing cross-test pollution.

### Fixes applied (`websocket.service.spec.ts`)

Added `take(1)` on `isConnected$` subscriptions in `done`-based tests to prevent `done called more than once`.

---

## Test Counts After P47

| Suite | Before | After |
|-------|--------|-------|
| Frontend (Karma/Jasmine) | 567 | **602 / 602** ✅ |
| Backend (Jest) | 179 | **188 / 188** ✅ |

---

## Files Created

| File | Purpose |
|------|---------|
| `space-invaders-client/src/app/core/services/error-handler.service.ts` | Service implementation |
| `space-invaders-client/src/app/core/services/error-handler.service.spec.ts` | Unit tests (TDD) |
| `tests/unit/middleware/error-handler.test.js` | Backend middleware tests (TDD) |

## Files Modified

| File | Change |
|------|--------|
| `src/middleware/validation.js` | Enhanced `errorHandler` with structured body + conditional stack |
| `space-invaders-client/src/app/core/services/api.service.ts` | Replaced private `handleError` with `ErrorHandlerService` |
| `space-invaders-client/src/app/core/services/api.service.spec.ts` | Added `MatSnackBar` spy + `IS_PRODUCTION` provider |
| `space-invaders-client/src/app/core/services/config.service.spec.ts` | Fixed flaky `setTimeout` tests |
| `space-invaders-client/src/app/core/services/highscore.service.spec.ts` | Fixed flaky `setTimeout` tests |
| `space-invaders-client/src/app/core/services/websocket.service.spec.ts` | Fixed `done` called twice via `take(1)` |
