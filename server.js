require('dotenv').config();
const express = require('express');
const cors = require('cors');
const configRoutes = require('./src/routes/config.routes');
const { handleJsonError, errorHandler, notFoundHandler } = require('./src/middleware/validation');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS || '*'
}));
app.use(express.json());

// Handle JSON parsing errors
app.use(handleJsonError);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// API Routes
app.use('/api/config', configRoutes);

// 404 handler for unknown routes
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// Start server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
