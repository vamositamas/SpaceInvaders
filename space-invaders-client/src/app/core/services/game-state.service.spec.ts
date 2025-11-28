import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { GameStateService } from './game-state.service';
import { GameConfig, LegacyGameState } from '../models';

describe('GameStateService', () => {
  let service: GameStateService;

  const mockConfig: GameConfig = {
    canvas: { width: 800, height: 600 },
    player: { speed: 5, fireRate: 500, lives: 3 },
    enemies: { rows: 5, columns: 11, baseSpeed: 1, speedIncrement: 0.1, fireRate: 2000 },
    difficulty: {
      easy: { speedMultiplier: 0.75, fireRateMultiplier: 1.5 },
      normal: { speedMultiplier: 1.0, fireRateMultiplier: 1.0 },
      hard: { speedMultiplier: 1.5, fireRateMultiplier: 0.5 }
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GameStateService,
        provideZonelessChangeDetection()
      ]
    });

    service = TestBed.inject(GameStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have gameState$ observable that emits initial state', (done) => {
    service.gameState$.subscribe((state: LegacyGameState) => {
      expect(state.score).toBe(0);
      expect(state.lives).toBe(3);
      expect(state.level).toBe(1);
      expect(state.isPaused).toBe(false);
      expect(state.isGameOver).toBe(false);
      expect(state.isPlaying).toBe(false);
      done();
    });
  });

  it('should have score$ observable that emits initial value', (done) => {
    service.score$.subscribe((score: number) => {
      expect(score).toBe(0);
      done();
    });
  });

  it('should have lives$ observable that emits initial value', (done) => {
    service.lives$.subscribe((lives: number) => {
      expect(lives).toBe(3);
      done();
    });
  });

  it('should have level$ observable that emits initial value', (done) => {
    service.level$.subscribe((level: number) => {
      expect(level).toBe(1);
      done();
    });
  });

  it('should have isPaused$ observable that emits initial value', (done) => {
    service.isPaused$.subscribe((isPaused: boolean) => {
      expect(isPaused).toBe(false);
      done();
    });
  });

  it('should have isGameOver$ observable that emits initial value', (done) => {
    service.isGameOver$.subscribe((isGameOver: boolean) => {
      expect(isGameOver).toBe(false);
      done();
    });
  });

  it('should initialize game with config values', (done) => {
    service.initGame(mockConfig);
    
    service.gameState$.subscribe((state: LegacyGameState) => {
      expect(state.lives).toBe(mockConfig.player.lives);
      expect(state.isPlaying).toBe(true);
      expect(state.score).toBe(0);
      expect(state.level).toBe(1);
      done();
    });
  });

  it('should add points to current score with updateScore', (done) => {
    const points = 100;
    service.updateScore(points);
    
    service.score$.subscribe((score: number) => {
      if (score > 0) {
        expect(score).toBe(points);
        done();
      }
    });
  });

  it('should emit new score value after updateScore', (done) => {
    const points1 = 100;
    const points2 = 50;
    
    service.updateScore(points1);
    service.updateScore(points2);
    
    service.score$.subscribe((score: number) => {
      if (score === points1 + points2) {
        expect(score).toBe(150);
        done();
      }
    });
  });

  it('should update lives observable with setLives', (done) => {
    const newLives = 2;
    service.setLives(newLives);
    
    service.lives$.subscribe((lives: number) => {
      if (lives === newLives) {
        expect(lives).toBe(newLives);
        done();
      }
    });
  });

  it('should update level observable with setLevel', (done) => {
    const newLevel = 2;
    service.setLevel(newLevel);
    
    service.level$.subscribe((level: number) => {
      if (level === newLevel) {
        expect(level).toBe(newLevel);
        done();
      }
    });
  });

  it('should set isPaused to true when pause is called', (done) => {
    service.pause();
    
    service.isPaused$.subscribe((isPaused: boolean) => {
      if (isPaused) {
        expect(isPaused).toBe(true);
        done();
      }
    });
  });

  it('should set isPaused to false when resume is called', (done) => {
    service.pause();
    service.resume();
    
    let emissionCount = 0;
    service.isPaused$.subscribe((isPaused: boolean) => {
      emissionCount++;
      // Skip initial false and paused true, check resumed false
      if (emissionCount === 3) {
        expect(isPaused).toBe(false);
        done();
      }
    });
  });

  it('should set isGameOver to true when gameOver is called', (done) => {
    service.gameOver();
    
    service.isGameOver$.subscribe((isGameOver: boolean) => {
      if (isGameOver) {
        expect(isGameOver).toBe(true);
        done();
      }
    });
  });

  it('should set isPlaying to false when gameOver is called', (done) => {
    service.initGame(mockConfig); // Start game
    service.gameOver();
    
    service.gameState$.subscribe((state: LegacyGameState) => {
      if (state.isGameOver) {
        expect(state.isPlaying).toBe(false);
        done();
      }
    });
  });

  it('should reset all state to defaults when resetGame is called', (done) => {
    // Modify state
    service.initGame(mockConfig);
    service.updateScore(500);
    service.setLevel(3);
    service.pause();
    
    // Reset
    service.resetGame();
    
    service.gameState$.subscribe((state: LegacyGameState) => {
      if (!state.isPlaying && state.score === 0) {
        expect(state.score).toBe(0);
        expect(state.lives).toBe(3);
        expect(state.level).toBe(1);
        expect(state.isPaused).toBe(false);
        expect(state.isGameOver).toBe(false);
        expect(state.isPlaying).toBe(false);
        done();
      }
    });
  });

  it('should combine all state into gameState$ observable', (done) => {
    service.initGame(mockConfig);
    service.updateScore(200);
    service.setLevel(2);
    
    service.gameState$.subscribe((state: LegacyGameState) => {
      if (state.score === 200 && state.level === 2) {
        expect(state.score).toBe(200);
        expect(state.level).toBe(2);
        expect(state.lives).toBe(mockConfig.player.lives);
        expect(state.isPaused).toBe(false);
        expect(state.isGameOver).toBe(false);
        expect(state.isPlaying).toBe(true);
        done();
      }
    });
  });
});
