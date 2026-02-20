const RateLimiter = require('../../../src/middleware/rate-limiter');

describe('RateLimiter', () => {
  let limiter;
  let mockRes;
  let next;

  const makeReq = (ip = '127.0.0.1') => ({ ip });
  const makeRes = () => {
    const res = { status: jest.fn(), json: jest.fn() };
    res.status.mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    limiter = new RateLimiter({ max: 3, windowMs: 60000 });
    mockRes = makeRes();
    next = jest.fn();
  });

  // ── within limit ──────────────────────────────────────────────────────────

  test('should call next for requests within limit', () => {
    limiter.middleware(makeReq(), makeRes(), next);
    expect(next).toHaveBeenCalledTimes(1);
  });

  test('should allow requests up to the max', () => {
    const res = makeRes();
    limiter.middleware(makeReq(), res, next);
    limiter.middleware(makeReq(), res, next);
    limiter.middleware(makeReq(), res, next);
    expect(next).toHaveBeenCalledTimes(3);
    expect(res.status).not.toHaveBeenCalled();
  });

  // ── limit exceeded ────────────────────────────────────────────────────────

  test('should return 429 when limit is exceeded', () => {
    const res = makeRes();
    // Use up all 3 slots
    limiter.middleware(makeReq(), res, next);
    limiter.middleware(makeReq(), res, next);
    limiter.middleware(makeReq(), res, next);
    // 4th request should be rate-limited
    limiter.middleware(makeReq(), res, next);
    expect(res.status).toHaveBeenCalledWith(429);
    expect(next).toHaveBeenCalledTimes(3); // 4th call did not reach next
  });

  test('should include error message in 429 response', () => {
    const res = makeRes();
    for (let i = 0; i <= 3; i++) {
      limiter.middleware(makeReq(), res, next);
    }
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
  });

  // ── reset ─────────────────────────────────────────────────────────────────

  test('resetStore should clear all tracked requests', () => {
    const res = makeRes();
    limiter.middleware(makeReq(), res, next);
    limiter.middleware(makeReq(), res, next);
    limiter.middleware(makeReq(), res, next);

    limiter.resetStore();

    // After reset, the 3 slots are free again
    limiter.middleware(makeReq(), res, next);
    expect(next).toHaveBeenCalledTimes(4);
  });

  // ── configure ─────────────────────────────────────────────────────────────

  test('configure should update max limit', () => {
    limiter.configure({ max: 1 });
    const res = makeRes();
    limiter.middleware(makeReq(), res, next);  // first — OK
    limiter.middleware(makeReq(), res, next);  // second — blocked
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(429);
  });

  // ── IP isolation ──────────────────────────────────────────────────────────

  test('should track different IPs independently', () => {
    const tight = new RateLimiter({ max: 1, windowMs: 60000 });
    const res = makeRes();
    tight.middleware(makeReq('1.1.1.1'), res, next);
    tight.middleware(makeReq('2.2.2.2'), res, next);
    // Both are allowed because they are different IPs
    expect(next).toHaveBeenCalledTimes(2);
    expect(res.status).not.toHaveBeenCalled();
  });

  test('should block only the IP that exceeded the limit', () => {
    const tight = new RateLimiter({ max: 1, windowMs: 60000 });
    tight.middleware(makeReq('1.1.1.1'), makeRes(), next); // IP1 — OK
    tight.middleware(makeReq('1.1.1.1'), makeRes(), next); // IP1 — blocked

    const res2 = makeRes();
    tight.middleware(makeReq('2.2.2.2'), res2, next); // IP2 — OK
    expect(res2.status).not.toHaveBeenCalled();
  });

  // ── window expiry ─────────────────────────────────────────────────────────

  test('should allow requests again after window expires', (done) => {
    const shortLimiter = new RateLimiter({ max: 1, windowMs: 50 });
    const res = makeRes();
    shortLimiter.middleware(makeReq(), res, next); // uses the 1 slot
    shortLimiter.middleware(makeReq(), res, next); // blocked

    setTimeout(() => {
      shortLimiter.middleware(makeReq(), res, next); // slot freed after 50ms window
      expect(next).toHaveBeenCalledTimes(2); // first + after window
      done();
    }, 80);
  });
});
