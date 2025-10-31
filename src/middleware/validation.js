/**
 * Request validation middleware
 */

/**
 * Validates that request body is not empty
 */
function validateNotEmpty(req, res, next) {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      error: 'Request body cannot be empty',
    });
  }
  next();
}

/**
 * Error handler for invalid JSON
 */
function handleJsonError(err, req, res, next) {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: 'Invalid JSON',
    });
  }
  next(err);
}

/**
 * Global error handler
 */
function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  // Default to 500 server error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: message,
  });
}

/**
 * 404 handler for unknown routes
 */
function notFoundHandler(req, res) {
  res.status(404).json({
    error: 'Not Found',
  });
}

module.exports = {
  validateNotEmpty,
  handleJsonError,
  errorHandler,
  notFoundHandler,
};
