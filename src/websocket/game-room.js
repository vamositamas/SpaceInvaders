/**
 * GameRoom — manages socket memberships and broadcasting for real-time
 * leaderboard / game-state updates via Socket.io.
 *
 * Architecture:
 *   - All clients join the 'leaderboard' room automatically.
 *   - broadcastGameState() uses io.to(roomId).emit() so every client in
 *     the room receives the update.
 *   - handlePlayerInput() re-broadcasts the input to the same room so
 *     all connected observers can react (useful for spectator mode).
 */
class GameRoom {
  /**
   * @param {import('socket.io').Server} io
   */
  constructor(io) {
    this.io = io;
    // socketId -> { playerId, roomId }
    this._players = new Map();
    // roomId -> Set<socketId>
    this._rooms = new Map();
  }

  // ── Public API ──────────────────────────────────────────────────────────

  /**
   * Register a socket and add it to the leaderboard room.
   * @param {string} socketId
   * @param {string} playerId
   * @returns {{ socketId, playerId, roomId }}
   */
  joinRoom(socketId, playerId) {
    const roomId = 'leaderboard';
    const info = { socketId, playerId, roomId };
    this._players.set(socketId, info);

    if (!this._rooms.has(roomId)) {
      this._rooms.set(roomId, new Set());
    }
    this._rooms.get(roomId).add(socketId);

    return { ...info };
  }

  /**
   * Remove a socket from its room and tracking.
   * @param {string} socketId
   * @returns {{ socketId, playerId, roomId } | null}
   */
  leaveRoom(socketId) {
    const info = this._players.get(socketId);
    if (!info) return null;

    this._players.delete(socketId);
    const roomSockets = this._rooms.get(info.roomId);
    if (roomSockets) {
      roomSockets.delete(socketId);
      if (roomSockets.size === 0) {
        this._rooms.delete(info.roomId);
      }
    }

    return { ...info };
  }

  /**
   * Broadcast a game state update to all sockets in the given room.
   * Automatically adds a timestamp to the payload.
   * @param {string} roomId
   * @param {object} state
   */
  broadcastGameState(roomId, state) {
    this.io.to(roomId).emit('gameUpdate', { ...state, timestamp: Date.now() });
  }

  /**
   * Handle a player input event by re-broadcasting it to the room.
   * No-op if the socket is not registered.
   * @param {string} socketId
   * @param {object} input
   */
  handlePlayerInput(socketId, input) {
    const info = this._players.get(socketId);
    if (!info) return;

    this.io.to(info.roomId).emit('playerInput', {
      socketId,
      playerId: info.playerId,
      input,
    });
  }

  // ── Query helpers (used by tests & setup) ───────────────────────────────

  /**
   * @param {string} socketId
   * @returns {{ socketId, playerId, roomId } | null}
   */
  getSocketInfo(socketId) {
    return this._players.get(socketId) ?? null;
  }

  /**
   * @param {string} roomId
   * @returns {number}
   */
  getRoomSize(roomId) {
    return this._rooms.get(roomId)?.size ?? 0;
  }
}

module.exports = GameRoom;
