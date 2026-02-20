import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { EnemyService, EnemyEntity } from './enemy.service';
import { GameConfig } from '../models';

describe('EnemyService', () => {
  let service: EnemyService;

  const mockConfig: GameConfig = {
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
      providers: [EnemyService, provideZonelessChangeDetection()]
    });
    service = TestBed.inject(EnemyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initGrid', () => {
    beforeEach(() => service.initGrid(mockConfig, 800));

    it('should create correct total number of enemies', () => {
      expect(service.getAllEnemies().length).toBe(55); // 5 × 11
    });

    it('should create all enemies as active', () => {
      expect(service.getAllEnemies().every(e => e.isActive)).toBe(true);
    });

    it('should assign enemy types by row', () => {
      const enemies = service.getAllEnemies();
      // Row 0 → squid (30 pts)
      const row0 = enemies.filter(e => e.row === 0);
      expect(row0.every(e => e.type === 'squid')).toBe(true);
      expect(row0.every(e => e.pointValue === 30)).toBe(true);

      // Rows 1–2 → crab (20 pts)
      const rows12 = enemies.filter(e => e.row === 1 || e.row === 2);
      expect(rows12.every(e => e.type === 'crab')).toBe(true);
      expect(rows12.every(e => e.pointValue === 20)).toBe(true);

      // Rows 3–4 → octopus (10 pts)
      const rows34 = enemies.filter(e => e.row === 3 || e.row === 4);
      expect(rows34.every(e => e.type === 'octopus')).toBe(true);
      expect(rows34.every(e => e.pointValue === 10)).toBe(true);
    });

    it('should centre the grid horizontally on the canvas', () => {
      const enemies = service.getAllEnemies();
      const minX = Math.min(...enemies.map(e => e.x));
      const maxX = Math.max(...enemies.map(e => e.x + e.width));
      const gridCenterX = (minX + maxX) / 2;
      expect(gridCenterX).toBeCloseTo(800 / 2, 0);
    });

    it('should set correct enemy dimensions', () => {
      const e = service.getAllEnemies()[0];
      expect(e.width).toBe(30);
      expect(e.height).toBe(20);
    });

    it('should assign row and col indices', () => {
      const enemies = service.getAllEnemies();
      expect(enemies.some(e => e.row === 0 && e.col === 0)).toBe(true);
      expect(enemies.some(e => e.row === 4 && e.col === 10)).toBe(true);
    });
  });

  describe('getActiveEnemies', () => {
    it('should return only active enemies', () => {
      service.initGrid(mockConfig, 800);
      service.getAllEnemies()[0].isActive = false;
      expect(service.getActiveEnemies().length).toBe(54);
    });
  });

  describe('areAllDestroyed', () => {
    it('should return false when enemies remain', () => {
      service.initGrid(mockConfig, 800);
      expect(service.areAllDestroyed()).toBe(false);
    });

    it('should return true when all enemies are inactive', () => {
      service.initGrid(mockConfig, 800);
      service.getAllEnemies().forEach(e => (e.isActive = false));
      expect(service.areAllDestroyed()).toBe(true);
    });
  });

  describe('getBottomEnemiesPerColumn', () => {
    it('should return the lowest active enemy in each column', () => {
      service.initGrid(mockConfig, 800);
      const bottom = service.getBottomEnemiesPerColumn();
      expect(bottom.length).toBe(11); // one per column
      // All returned enemies should be in row 4 (the bottom-most)
      expect(bottom.every(e => e.row === 4)).toBe(true);
    });

    it('should return higher enemy when bottom row is destroyed', () => {
      service.initGrid(mockConfig, 800);
      // Deactivate all row-4 enemies in column 0
      service.getAllEnemies()
        .filter(e => e.row === 4 && e.col === 0)
        .forEach(e => (e.isActive = false));
      const bottom = service.getBottomEnemiesPerColumn();
      const col0 = bottom.find(e => e.col === 0)!;
      expect(col0.row).toBe(3);
    });
  });
});
