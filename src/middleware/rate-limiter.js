/**
 * RateLimiter — simple in-memory rate limiter middleware factory.
 *
 * Usage:
 *   const limiter = new RateLimiter({ max: 20, windowMs: 60 * 60 * 1000 });
 *   router.post('/', (req, res, next) => limiter.middleware(req, res, next), handler);
 *
 * Exposed methods for testability:
 *   limiter.resetStore()          — clear all tracked requests
 *   limiter.configure({ max })    — update options at runtime
 */
class RateLimiter {
  /**
   * @param {object} [options]
   * @param {number} [options.max=20]              Max requests per window per IP
   * @param {number} [options.windowMs=3600000]    Window duration in ms (default 1h)
   */
  constructor(options = {}) {
    this.max = options.max ?? 20;
    this.windowMs = options.windowMs ?? 60 * 60 * 1000;
    this._store = new Map(); // ip → number[]  (Unix ms timestamps)
  }

  /**
   * Update rate-limiter options at runtime (useful in tests).
   * @param {object} options
   */
  configure(options) {
    if (options.max !== undefined) this.max = options.max;
    if (options.windowMs !== undefined) this.windowMs = options.windowMs;
  }

  /** Clear all tracked IP records. */
  resetStore() {
    this._store.clear();
  }

  /**
   * Express middleware. Tracks requests per IP and returns 429 when the
   * per-window limit is exceeded.
   * @param {import('express').Request}  req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  middleware(req, res, next) {
    const ip = req.ip || req.connection?.remoteAddress || 'unknown';
    const now = Date.now();
    const windowStart = now - this.windowMs;

    // Expire old timestamps and retrieve active ones
    const timestamps = (this._store.get(ip) || []).filter(t => t > windowStart);

    if (timestamps.length >= this.max) {
      return res.status(429).json({
        error: 'Too many score submissions. Please try again later.',
      });
    }

    timestamps.push(now);
    this._store.set(ip, timestamps);
    next();
  }
}

module.exports = RateLimiter;
