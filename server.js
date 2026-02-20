require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const configRoutes = require('./src/routes/config.routes');
const highScoreRoutes = require('./src/routes/highscore.routes');
const settingsRoutes = require('./src/routes/settings.routes');
const { handleJsonError, errorHandler, notFoundHandler } = require('./src/middleware/validation');
const GameRoom = require('./src/websocket/game-room');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.ALLOWED_ORIGINS || '*' }
});

const gameRoom = new GameRoom(io);

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
app.use('/api/highscores', highScoreRoutes);
app.use('/api/settings', settingsRoutes);

// 404 handler for unknown routes
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// Socket.io connection handling
io.on('connection', (socket) => {
  const playerId = socket.handshake.query.playerId || socket.id;
  gameRoom.joinRoom(socket.id, String(playerId));

  socket.on('playerInput', (input) => {
    gameRoom.handlePlayerInput(socket.id, input);
  });

  socket.on('disconnect', () => {
    gameRoom.leaveRoom(socket.id);
  });
});

// Start server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
module.exports.io = io;
module.exports.server = server;
module.exports.gameRoom = gameRoom;
