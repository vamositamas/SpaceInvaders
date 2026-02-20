import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { CollisionService, Rect } from './collision.service';

describe('CollisionService', () => {
  let service: CollisionService;

  const makeRect = (x: number, y: number, w: number, h: number): Rect => ({
    x, y, width: w, height: h, isActive: true
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CollisionService, provideZonelessChangeDetection()]
    });
    service = TestBed.inject(CollisionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('checkAABB', () => {
    it('should return true for overlapping rectangles', () => {
      const a = makeRect(0, 0, 50, 50);
      const b = makeRect(25, 25, 50, 50);
      expect(service.checkAABB(a, b)).toBe(true);
    });

    it('should return false for non-overlapping rectangles (right of)', () => {
      const a = makeRect(0, 0, 50, 50);
      const b = makeRect(60, 0, 50, 50);
      expect(service.checkAABB(a, b)).toBe(false);
    });

    it('should return false for non-overlapping rectangles (below)', () => {
      const a = makeRect(0, 0, 50, 50);
      const b = makeRect(0, 60, 50, 50);
      expect(service.checkAABB(a, b)).toBe(false);
    });

    it('should return false for touching edges (no overlap)', () => {
      const a = makeRect(0, 0, 50, 50);
      const b = makeRect(50, 0, 50, 50); // touches at x=50
      expect(service.checkAABB(a, b)).toBe(false);
    });

    it('should return false when inactive', () => {
      const a = { ...makeRect(0, 0, 50, 50), isActive: false };
      const b = makeRect(10, 10, 50, 50);
      expect(service.checkAABB(a, b)).toBe(false);
    });

    it('should return true for one rect fully inside the other', () => {
      const a = makeRect(0, 0, 100, 100);
      const b = makeRect(25, 25, 10, 10);
      expect(service.checkAABB(a, b)).toBe(true);
    });
  });

  describe('checkProjectilesVsTargets', () => {
    it('should return pairs of colliding projectile and target', () => {
      const projectile = makeRect(20, 20, 4, 15);
      const target = makeRect(10, 10, 30, 20);
      const results = service.checkProjectilesVsTargets([projectile], [target]);
      expect(results.length).toBe(1);
      expect(results[0].projectile).toBe(projectile);
      expect(results[0].target).toBe(target);
    });

    it('should return empty array when no collisions', () => {
      const projectile = makeRect(200, 200, 4, 15);
      const target = makeRect(10, 10, 30, 20);
      expect(service.checkProjectilesVsTargets([projectile], [target]).length).toBe(0);
    });

    it('should skip inactive projectiles', () => {
      const projectile = { ...makeRect(20, 20, 4, 15), isActive: false };
      const target = makeRect(10, 10, 30, 30);
      expect(service.checkProjectilesVsTargets([projectile], [target]).length).toBe(0);
    });

    it('should skip inactive targets', () => {
      const projectile = makeRect(20, 20, 4, 15);
      const target = { ...makeRect(10, 10, 30, 30), isActive: false };
      expect(service.checkProjectilesVsTargets([projectile], [target]).length).toBe(0);
    });

    it('should handle multiple collisions in one frame', () => {
      const p1 = makeRect(10, 10, 4, 15);
      const p2 = makeRect(50, 10, 4, 15);
      const t1 = makeRect(5, 5, 20, 20);
      const t2 = makeRect(45, 5, 20, 20);
      const results = service.checkProjectilesVsTargets([p1, p2], [t1, t2]);
      expect(results.length).toBe(2);
    });
  });

  describe('checkAnyCollision', () => {
    it('should return true when projectile hits the given rect', () => {
      const projectile = makeRect(20, 20, 4, 15);
      const target = makeRect(10, 10, 30, 30);
      expect(service.checkAnyCollision([projectile], target)).toBe(true);
    });

    it('should return false when no projectile hits the given rect', () => {
      const projectile = makeRect(200, 200, 4, 15);
      const target = makeRect(10, 10, 30, 30);
      expect(service.checkAnyCollision([projectile], target)).toBe(false);
    });
  });
});
