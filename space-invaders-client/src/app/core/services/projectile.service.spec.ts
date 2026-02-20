import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ProjectileService, Projectile } from './projectile.service';

describe('ProjectileService', () => {
  let service: ProjectileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjectileService, provideZonelessChangeDetection()]
    });
    service = TestBed.inject(ProjectileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('addPlayerProjectile', () => {
    it('should add a projectile to the player list', () => {
      service.addPlayerProjectile(100, 200);
      expect(service.getPlayerProjectiles().length).toBe(1);
    });

    it('should create projectile at specified position', () => {
      service.addPlayerProjectile(100, 200);
      const p = service.getPlayerProjectiles()[0];
      expect(p.x).toBe(100);
      expect(p.y).toBe(200);
    });

    it('should create projectile with upward velocity', () => {
      service.addPlayerProjectile(100, 200);
      const p = service.getPlayerProjectiles()[0];
      expect(p.vy).toBeLessThan(0);
    });

    it('should create active projectile', () => {
      service.addPlayerProjectile(100, 200);
      expect(service.getPlayerProjectiles()[0].isActive).toBe(true);
    });

    it('should set correct projectile dimensions', () => {
      service.addPlayerProjectile(100, 200);
      const p = service.getPlayerProjectiles()[0];
      expect(p.width).toBe(4);
      expect(p.height).toBe(15);
    });
  });

  describe('addEnemyProjectile', () => {
    it('should add a projectile to the enemy list', () => {
      service.addEnemyProjectile(300, 100);
      expect(service.getEnemyProjectiles().length).toBe(1);
    });

    it('should create projectile with downward velocity', () => {
      service.addEnemyProjectile(300, 100);
      const p = service.getEnemyProjectiles()[0];
      expect(p.vy).toBeGreaterThan(0);
    });
  });

  describe('update', () => {
    it('should move player projectiles upward each frame', () => {
      service.addPlayerProjectile(100, 300);
      const startY = service.getPlayerProjectiles()[0].y;
      service.update(16, 600);
      expect(service.getPlayerProjectiles()[0].y).toBeLessThan(startY);
    });

    it('should move enemy projectiles downward each frame', () => {
      service.addEnemyProjectile(300, 100);
      const startY = service.getEnemyProjectiles()[0].y;
      service.update(16, 600);
      expect(service.getEnemyProjectiles()[0].y).toBeGreaterThan(startY);
    });

    it('should remove player projectile that goes above canvas', () => {
      service.addPlayerProjectile(100, 0);
      service.update(100, 600); // large deltaTime to push it off screen
      const active = service.getPlayerProjectiles().filter(p => p.isActive);
      expect(active.length).toBe(0);
    });

    it('should remove enemy projectile that goes below canvas', () => {
      service.addEnemyProjectile(300, 600);
      service.update(100, 600);
      const active = service.getEnemyProjectiles().filter(p => p.isActive);
      expect(active.length).toBe(0);
    });

    it('should use deltaTime for frame-independent movement', () => {
      service.addPlayerProjectile(100, 400);
      const y0 = service.getPlayerProjectiles()[0].y;
      service.update(32, 600);
      const moved32 = y0 - service.getPlayerProjectiles()[0].y;

      service.clear();
      service.addPlayerProjectile(100, 400);
      service.update(16, 600);
      const moved16 = y0 - service.getPlayerProjectiles()[0].y;

      expect(moved32).toBeCloseTo(moved16 * 2, 0);
    });
  });

  describe('deactivate', () => {
    it('should mark a projectile as inactive', () => {
      service.addPlayerProjectile(100, 300);
      const p = service.getPlayerProjectiles()[0];
      service.deactivate(p);
      expect(p.isActive).toBe(false);
    });
  });

  describe('clear', () => {
    it('should remove all projectiles', () => {
      service.addPlayerProjectile(100, 200);
      service.addEnemyProjectile(300, 100);
      service.clear();
      expect(service.getPlayerProjectiles().length).toBe(0);
      expect(service.getEnemyProjectiles().length).toBe(0);
    });
  });

  describe('getActivePlayerProjectiles / getActiveEnemyProjectiles', () => {
    it('should return only active player projectiles', () => {
      service.addPlayerProjectile(100, 200);
      service.addPlayerProjectile(200, 200);
      service.deactivate(service.getPlayerProjectiles()[0]);
      expect(service.getActivePlayerProjectiles().length).toBe(1);
    });

    it('should return only active enemy projectiles', () => {
      service.addEnemyProjectile(300, 100);
      service.addEnemyProjectile(400, 100);
      service.deactivate(service.getEnemyProjectiles()[0]);
      expect(service.getActiveEnemyProjectiles().length).toBe(1);
    });
  });
});
