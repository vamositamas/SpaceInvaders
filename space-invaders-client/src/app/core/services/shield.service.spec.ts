import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ShieldService, ShieldEntity } from './shield.service';

describe('ShieldService', () => {
  let service: ShieldService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ShieldService, provideZonelessChangeDetection()]
    });
    service = TestBed.inject(ShieldService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initShields', () => {
    beforeEach(() => service.initShields(800, 600));

    it('should create 4 shields', () => {
      expect(service.getShields().length).toBe(4);
    });

    it('should create all shields as active', () => {
      expect(service.getShields().every(s => s.isActive)).toBe(true);
    });

    it('should set full health on each shield', () => {
      service.getShields().forEach(s => {
        expect(s.health).toBe(s.maxHealth);
      });
    });

    it('should set correct shield dimensions', () => {
      service.getShields().forEach(s => {
        expect(s.width).toBe(60);
        expect(s.height).toBe(40);
      });
    });

    it('should place shields near bottom of canvas', () => {
      service.getShields().forEach(s => {
        expect(s.y).toBeGreaterThan(400);
        expect(s.y).toBeLessThan(600);
      });
    });

    it('should distribute shields evenly across canvas width', () => {
      const xs = service.getShields().map(s => s.x);
      // All x positions should be different
      const unique = new Set(xs);
      expect(unique.size).toBe(4);
      // Leftmost shield should be on the left half, rightmost on the right half
      expect(Math.min(...xs)).toBeLessThan(400);
      expect(Math.max(...xs)).toBeGreaterThan(400);
    });
  });

  describe('damageShield', () => {
    beforeEach(() => service.initShields(800, 600));

    it('should reduce shield health by one damage unit', () => {
      const shield = service.getShields()[0];
      const initialHealth = shield.health;
      service.damageShield(shield);
      expect(shield.health).toBe(initialHealth - ShieldService.DAMAGE_PER_HIT);
    });

    it('should deactivate shield when health reaches zero', () => {
      const shield = service.getShields()[0];
      const hits = shield.maxHealth / ShieldService.DAMAGE_PER_HIT;
      for (let i = 0; i < hits; i++) {
        service.damageShield(shield);
      }
      expect(shield.isActive).toBe(false);
    });

    it('should not reduce health below zero', () => {
      const shield = service.getShields()[0];
      // Destroy completely then hit again
      const hits = shield.maxHealth / ShieldService.DAMAGE_PER_HIT;
      for (let i = 0; i < hits + 2; i++) {
        service.damageShield(shield);
      }
      expect(shield.health).toBe(0);
    });
  });

  describe('getActiveShields', () => {
    it('should return only active shields', () => {
      service.initShields(800, 600);
      service.getShields()[0].isActive = false;
      expect(service.getActiveShields().length).toBe(3);
    });
  });
});
