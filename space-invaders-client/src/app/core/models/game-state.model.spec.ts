import {
  GameState,
  createInitialGameState,
  GameStatus
} from './game-state.model';
import { createPlayer, createEnemy, createShield, createProjectile } from './game-entities.model';

describe('Game State Model', () => {
  describe('GameStatus enum', () => {
    it('should have READY status', () => {
      expect(GameStatus.READY).toBeDefined();
    });

    it('should have PLAYING status', () => {
      expect(GameStatus.PLAYING).toBeDefined();
    });

    it('should have PAUSED status', () => {
      expect(GameStatus.PAUSED).toBeDefined();
    });

    it('should have GAME_OVER status', () => {
      expect(GameStatus.GAME_OVER).toBeDefined();
    });

    it('should have LEVEL_COMPLETE status', () => {
      expect(GameStatus.LEVEL_COMPLETE).toBeDefined();
    });
  });

  describe('GameState interface', () => {
    it('should have score property', () => {
      const gameState: GameState = {
        score: 1000,
        level: 1,
        lives: 3,
        status: GameStatus.PLAYING,
        isPaused: false,
        player: createPlayer(400, 550),
        enemies: [],
        projectiles: [],
        shields: []
      };
      expect(gameState.score).toBe(1000);
    });

    it('should have level property', () => {
      const gameState: GameState = {
        score: 0,
        level: 2,
        lives: 3,
        status: GameStatus.PLAYING,
        isPaused: false,
        player: createPlayer(400, 550),
        enemies: [],
        projectiles: [],
        shields: []
      };
      expect(gameState.level).toBe(2);
    });

    it('should have lives property', () => {
      const gameState: GameState = {
        score: 0,
        level: 1,
        lives: 2,
        status: GameStatus.PLAYING,
        isPaused: false,
        player: createPlayer(400, 550),
        enemies: [],
        projectiles: [],
        shields: []
      };
      expect(gameState.lives).toBe(2);
    });

    it('should have status property', () => {
      const gameState: GameState = {
        score: 0,
        level: 1,
        lives: 3,
        status: GameStatus.PAUSED,
        isPaused: true,
        player: createPlayer(400, 550),
        enemies: [],
        projectiles: [],
        shields: []
      };
      expect(gameState.status).toBe(GameStatus.PAUSED);
    });

    it('should have isPaused property', () => {
      const gameState: GameState = {
        score: 0,
        level: 1,
        lives: 3,
        status: GameStatus.PLAYING,
        isPaused: false,
        player: createPlayer(400, 550),
        enemies: [],
        projectiles: [],
        shields: []
      };
      expect(gameState.isPaused).toBe(false);
    });

    it('should have player property', () => {
      const player = createPlayer(400, 550);
      const gameState: GameState = {
        score: 0,
        level: 1,
        lives: 3,
        status: GameStatus.PLAYING,
        isPaused: false,
        player,
        enemies: [],
        projectiles: [],
        shields: []
      };
      expect(gameState.player).toBe(player);
    });

    it('should have enemies array', () => {
      const enemies = [
        createEnemy(100, 100, 'squid', 0, 0),
        createEnemy(150, 100, 'crab', 1, 0)
      ];
      const gameState: GameState = {
        score: 0,
        level: 1,
        lives: 3,
        status: GameStatus.PLAYING,
        isPaused: false,
        player: createPlayer(400, 550),
        enemies,
        projectiles: [],
        shields: []
      };
      expect(gameState.enemies).toEqual(enemies);
      expect(gameState.enemies.length).toBe(2);
    });

    it('should have projectiles array', () => {
      const projectiles = [
        createProjectile(400, 500, -5, 'player'),
        createProjectile(150, 200, 5, 'enemy')
      ];
      const gameState: GameState = {
        score: 0,
        level: 1,
        lives: 3,
        status: GameStatus.PLAYING,
        isPaused: false,
        player: createPlayer(400, 550),
        enemies: [],
        projectiles,
        shields: []
      };
      expect(gameState.projectiles).toEqual(projectiles);
      expect(gameState.projectiles.length).toBe(2);
    });

    it('should have shields array', () => {
      const shields = [
        createShield(100, 400),
        createShield(300, 400),
        createShield(500, 400)
      ];
      const gameState: GameState = {
        score: 0,
        level: 1,
        lives: 3,
        status: GameStatus.PLAYING,
        isPaused: false,
        player: createPlayer(400, 550),
        enemies: [],
        projectiles: [],
        shields
      };
      expect(gameState.shields).toEqual(shields);
      expect(gameState.shields.length).toBe(3);
    });
  });

  describe('createInitialGameState factory function', () => {
    it('should create a GameState with score of 0', () => {
      const gameState = createInitialGameState();
      expect(gameState.score).toBe(0);
    });

    it('should create a GameState with level of 1', () => {
      const gameState = createInitialGameState();
      expect(gameState.level).toBe(1);
    });

    it('should create a GameState with 3 lives', () => {
      const gameState = createInitialGameState();
      expect(gameState.lives).toBe(3);
    });

    it('should create a GameState with READY status', () => {
      const gameState = createInitialGameState();
      expect(gameState.status).toBe(GameStatus.READY);
    });

    it('should create a GameState with isPaused false', () => {
      const gameState = createInitialGameState();
      expect(gameState.isPaused).toBe(false);
    });

    it('should create a player at default position', () => {
      const gameState = createInitialGameState();
      expect(gameState.player).toBeDefined();
      expect(gameState.player.position.x).toBe(400);
      expect(gameState.player.position.y).toBe(550);
    });

    it('should create an empty enemies array', () => {
      const gameState = createInitialGameState();
      expect(gameState.enemies).toEqual([]);
      expect(Array.isArray(gameState.enemies)).toBe(true);
    });

    it('should create an empty projectiles array', () => {
      const gameState = createInitialGameState();
      expect(gameState.projectiles).toEqual([]);
      expect(Array.isArray(gameState.projectiles)).toBe(true);
    });

    it('should create an empty shields array', () => {
      const gameState = createInitialGameState();
      expect(gameState.shields).toEqual([]);
      expect(Array.isArray(gameState.shields)).toBe(true);
    });

    it('should create a new GameState instance each time', () => {
      const state1 = createInitialGameState();
      const state2 = createInitialGameState();
      expect(state1).not.toBe(state2);
      expect(state1.player).not.toBe(state2.player);
    });
  });

  describe('GameState immutability', () => {
    it('should allow creating a copy with updated score', () => {
      const state1 = createInitialGameState();
      const state2: GameState = { ...state1, score: 100 };
      expect(state1.score).toBe(0);
      expect(state2.score).toBe(100);
    });

    it('should allow creating a copy with updated level', () => {
      const state1 = createInitialGameState();
      const state2: GameState = { ...state1, level: 2 };
      expect(state1.level).toBe(1);
      expect(state2.level).toBe(2);
    });

    it('should allow creating a copy with updated status', () => {
      const state1 = createInitialGameState();
      const state2: GameState = { ...state1, status: GameStatus.PLAYING };
      expect(state1.status).toBe(GameStatus.READY);
      expect(state2.status).toBe(GameStatus.PLAYING);
    });

    it('should allow creating a copy with updated isPaused', () => {
      const state1 = createInitialGameState();
      const state2: GameState = { ...state1, isPaused: true };
      expect(state1.isPaused).toBe(false);
      expect(state2.isPaused).toBe(true);
    });

    it('should allow creating a copy with updated enemies array', () => {
      const state1 = createInitialGameState();
      const enemies = [createEnemy(100, 100, 'squid', 0, 0)];
      const state2: GameState = { ...state1, enemies };
      expect(state1.enemies.length).toBe(0);
      expect(state2.enemies.length).toBe(1);
    });
  });
});
