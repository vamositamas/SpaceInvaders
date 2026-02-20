const {
  errorHandler,
  handleJsonError,
  notFoundHandler,
} = require('../../../src/middleware/validation');

// Minimal Express mock helpers
const makeRes = (status = 200) => {
  const res = { status: jest.fn(), json: jest.fn(), sent: false };
  res.status.mockReturnValue(res);
  return res;
};
const makeReq = (overrides = {}) => ({
  method: 'GET',
  url: '/test',
  ip: '127.0.0.1',
  ...overrides,
});
const next = jest.fn();

describe('Error Handler Middleware', () => {
  // ── errorHandler ──────────────────────────────────────────────────────────

  describe('errorHandler', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('should respond with 500 for generic errors', () => {
      const err = new Error('Something went wrong');
      const res = makeRes();
      errorHandler(err, makeReq(), res, next);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
    });

    test('should use err.statusCode when provided', () => {
      const err = Object.assign(new Error('Bad input'), { statusCode: 422 });
      const res = makeRes();
      errorHandler(err, makeReq(), res, next);
      expect(res.status).toHaveBeenCalledWith(422);
    });

    test('should format the response with error and statusCode fields', () => {
      const err = new Error('Test error');
      const res = makeRes();
      errorHandler(err, makeReq(), res, next);
      const body = res.json.mock.calls[0][0];
      expect(body).toHaveProperty('error');
      expect(body).toHaveProperty('statusCode');
    });

    test('should omit stack trace in production', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      const err = new Error('Prod error');
      const res = makeRes();
      errorHandler(err, makeReq(), res, next);
      const body = res.json.mock.calls[0][0];
      expect(body).not.toHaveProperty('stack');
      process.env.NODE_ENV = originalEnv;
    });

    test('should include stack trace in development', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      const err = new Error('Dev error');
      const res = makeRes();
      errorHandler(err, makeReq(), res, next);
      const body = res.json.mock.calls[0][0];
      expect(body).toHaveProperty('stack');
      process.env.NODE_ENV = originalEnv;
    });

    test('should include stack trace in test environment', () => {
      // NODE_ENV is 'test' when jest runs
      const err = new Error('Test env error');
      const res = makeRes();
      errorHandler(err, makeReq(), res, next);
      const body = res.json.mock.calls[0][0];
      expect(body).toHaveProperty('stack');
    });
  });

  // ── handleJsonError ───────────────────────────────────────────────────────

  describe('handleJsonError', () => {
    test('should return 400 for SyntaxError with status 400 and body', () => {
      const err = Object.assign(new SyntaxError('Unexpected token'), { status: 400, body: '{}' });
      const res = makeRes();
      handleJsonError(err, makeReq(), res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Invalid JSON' }));
    });

    test('should call next for non-JSON errors', () => {
      const err = new Error('Other error');
      const res = makeRes();
      handleJsonError(err, makeReq(), res, next);
      expect(next).toHaveBeenCalledWith(err);
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  // ── notFoundHandler ───────────────────────────────────────────────────────

  describe('notFoundHandler', () => {
    test('should return 404 with error message', () => {
      const res = makeRes();
      notFoundHandler(makeReq(), res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
    });
  });
});
