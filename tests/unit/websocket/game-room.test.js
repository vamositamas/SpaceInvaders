const GameRoom = require('../../../src/websocket/game-room');

describe('GameRoom', () => {
  let gameRoom;
  let mockIo;
  let mockEmit;
  let mockTo;

  beforeEach(() => {
    mockEmit = jest.fn();
    mockTo = jest.fn().mockReturnValue({ emit: mockEmit });
    mockIo = { to: mockTo, emit: jest.fn() };
    gameRoom = new GameRoom(mockIo);
  });

  // ── joinRoom ──────────────────────────────────────────────────────────────

  describe('joinRoom', () => {
    test('should track the player under the given socketId', () => {
      gameRoom.joinRoom('socket1', 'player1');
      const info = gameRoom.getSocketInfo('socket1');
      expect(info).toBeDefined();
      expect(info.playerId).toBe('player1');
    });

    test('should add the socket to the default leaderboard room', () => {
      gameRoom.joinRoom('socket1', 'player1');
      const info = gameRoom.getSocketInfo('socket1');
      expect(info.roomId).toBe('leaderboard');
    });

    test('should allow multiple players in the room', () => {
      gameRoom.joinRoom('socket1', 'player1');
      gameRoom.joinRoom('socket2', 'player2');
      expect(gameRoom.getRoomSize('leaderboard')).toBe(2);
    });

    test('should return the player info on join', () => {
      const info = gameRoom.joinRoom('socket1', 'player1');
      expect(info).toEqual(expect.objectContaining({ playerId: 'player1', roomId: 'leaderboard' }));
    });
  });

  // ── leaveRoom ─────────────────────────────────────────────────────────────

  describe('leaveRoom', () => {
    test('should remove the socket from tracking', () => {
      gameRoom.joinRoom('socket1', 'player1');
      gameRoom.leaveRoom('socket1');
      expect(gameRoom.getSocketInfo('socket1')).toBeNull();
    });

    test('should decrease room size on leave', () => {
      gameRoom.joinRoom('socket1', 'player1');
      gameRoom.joinRoom('socket2', 'player2');
      gameRoom.leaveRoom('socket1');
      expect(gameRoom.getRoomSize('leaderboard')).toBe(1);
    });

    test('should be a no-op for unknown socketId', () => {
      expect(() => gameRoom.leaveRoom('unknown-socket')).not.toThrow();
    });

    test('should return the removed player info', () => {
      gameRoom.joinRoom('socket1', 'player1');
      const info = gameRoom.leaveRoom('socket1');
      expect(info).toEqual(expect.objectContaining({ playerId: 'player1' }));
    });

    test('should return null when socketId not found', () => {
      expect(gameRoom.leaveRoom('ghost')).toBeNull();
    });
  });

  // ── broadcastGameState ────────────────────────────────────────────────────

  describe('broadcastGameState', () => {
    test('should emit gameUpdate event to the specified room', () => {
      const state = { score: 1000, level: 3 };
      gameRoom.broadcastGameState('leaderboard', state);
      expect(mockTo).toHaveBeenCalledWith('leaderboard');
      expect(mockEmit).toHaveBeenCalledWith('gameUpdate', expect.objectContaining(state));
    });

    test('should emit to any specified room', () => {
      const state = { scores: [] };
      gameRoom.broadcastGameState('custom-room', state);
      expect(mockTo).toHaveBeenCalledWith('custom-room');
      expect(mockEmit).toHaveBeenCalledWith('gameUpdate', expect.objectContaining(state));
    });

    test('should include a timestamp in the emitted data', () => {
      gameRoom.broadcastGameState('leaderboard', { score: 100 });
      const emittedData = mockEmit.mock.calls[0][1];
      expect(emittedData).toHaveProperty('timestamp');
    });
  });

  // ── handlePlayerInput ─────────────────────────────────────────────────────

  describe('handlePlayerInput', () => {
    test('should broadcast input event to the room when socket is registered', () => {
      gameRoom.joinRoom('socket1', 'player1');
      gameRoom.handlePlayerInput('socket1', { key: 'ArrowLeft' });
      expect(mockTo).toHaveBeenCalledWith('leaderboard');
      expect(mockEmit).toHaveBeenCalledWith('playerInput', expect.objectContaining({
        playerId: 'player1',
        input: { key: 'ArrowLeft' }
      }));
    });

    test('should be a no-op for unknown socketId', () => {
      expect(() => gameRoom.handlePlayerInput('ghost', { key: 'ArrowLeft' })).not.toThrow();
      expect(mockTo).not.toHaveBeenCalled();
    });

    test('should include socketId in the emitted input data', () => {
      gameRoom.joinRoom('socket1', 'player1');
      gameRoom.handlePlayerInput('socket1', { key: 'Space' });
      const emittedData = mockEmit.mock.calls[0][1];
      expect(emittedData.socketId).toBe('socket1');
    });
  });

  // ── helper getters ────────────────────────────────────────────────────────

  describe('getRoomSize', () => {
    test('should return 0 for empty or unknown room', () => {
      expect(gameRoom.getRoomSize('leaderboard')).toBe(0);
      expect(gameRoom.getRoomSize('nonexistent')).toBe(0);
    });
  });
});
