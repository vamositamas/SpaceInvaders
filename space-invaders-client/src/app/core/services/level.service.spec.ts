import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { LevelService } from './level.service';
import { GameConfig } from '../models';

describe('LevelService', () => {
  let service: LevelService;

  const baseConfig: GameConfig = {
    canvas: { width: 800, height: 600 },
    player: { speed: 5, fireRate: 500, lives: 3 },
    enemies: { rows: 5, columns: 11, baseSpeed: 1, speedIncrement: 0.1, fireRate: 2000 },
    difficulty: {
      easy: { speedMultiplier: 0.75, fireRateMultiplier: 0.75 },
      normal: { speedMultiplier: 1, fireRateMultiplier: 1 },
      hard: { speedMultiplier: 1.5, fireRateMultiplier: 1.5 }
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LevelService, provideZonelessChangeDetection()]
    });
    service = TestBed.inject(LevelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start at level 1', () => {
    expect(service.getCurrentLevel()).toBe(1);
  });

  it('should increment level on nextLevel()', () => {
    service.nextLevel();
    expect(service.getCurrentLevel()).toBe(2);
  });

  it('should reset to level 1', () => {
    service.nextLevel();
    service.nextLevel();
    service.reset();
    expect(service.getCurrentLevel()).toBe(1);
  });

  describe('getLevelConfig', () => {
    it('should return unmodified base config for level 1', () => {
      const cfg = service.getLevelConfig(1, baseConfig);
      expect(cfg.enemies.baseSpeed).toBeCloseTo(baseConfig.enemies.baseSpeed, 5);
      expect(cfg.enemies.fireRate).toBeCloseTo(baseConfig.enemies.fireRate, 5);
    });

    it('should increase enemy speed by 10% per level beyond level 1', () => {
      const cfg = service.getLevelConfig(2, baseConfig);
      expect(cfg.enemies.baseSpeed).toBeCloseTo(baseConfig.enemies.baseSpeed * 1.1, 5);
    });

    it('should decrease fire rate (more frequent) by 5% per level beyond level 1', () => {
      const cfg = service.getLevelConfig(2, baseConfig);
      expect(cfg.enemies.fireRate).toBeCloseTo(baseConfig.enemies.fireRate * 0.95, 5);
    });

    it('should apply compounding multipliers for higher levels', () => {
      const cfg3 = service.getLevelConfig(3, baseConfig);
      expect(cfg3.enemies.baseSpeed).toBeCloseTo(baseConfig.enemies.baseSpeed * 1.1 * 1.1, 5);
    });

    it('should cap enemy speed at 10× base', () => {
      const cfg = service.getLevelConfig(100, baseConfig);
      expect(cfg.enemies.baseSpeed).toBeLessThanOrEqual(baseConfig.enemies.baseSpeed * 10);
    });

    it('should not reduce fire rate below 500ms', () => {
      const cfg = service.getLevelConfig(100, baseConfig);
      expect(cfg.enemies.fireRate).toBeGreaterThanOrEqual(500);
    });
  });
});
