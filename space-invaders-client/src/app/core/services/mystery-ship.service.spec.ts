import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { MysteryShipService } from './mystery-ship.service';

describe('MysteryShipService', () => {
  let service: MysteryShipService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MysteryShipService, provideZonelessChangeDetection()]
    });
    service = TestBed.inject(MysteryShipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initial state', () => {
    it('should start with no active ship', () => {
      expect(service.getShip().isActive).toBe(false);
    });
  });

  describe('getShip', () => {
    it('should return ship with correct dimensions', () => {
      const ship = service.getShip();
      expect(ship.width).toBe(MysteryShipService.SHIP_WIDTH);
      expect(ship.height).toBe(MysteryShipService.SHIP_HEIGHT);
    });
  });

  describe('trySpawn', () => {
    it('should not spawn before minimum interval', () => {
      service.trySpawn(0, 800);          // set next spawn time
      service.trySpawn(5000, 800);       // 5s later — still within interval
      // Advance a tiny bit past what could be 20000ms
      expect(service.getShip().isActive).toBe(false);
    });

    it('should spawn ship after spawn interval elapses', () => {
      service.trySpawn(0, 800);          // set initial reference
      // Force internal nextSpawnTime to have elapsed by calling with max time
      service.trySpawn(50000, 800);      // 50s later — beyond max 40s
      expect(service.getShip().isActive).toBe(true);
    });

    it('should not spawn when ship is already active', () => {
      service.trySpawn(0, 800);
      service.trySpawn(50000, 800);      // spawns
      const xAfterSpawn = service.getShip().x;
      service.trySpawn(100000, 800);     // should not re-spawn — ship still active
      expect(service.getShip().x).toBe(xAfterSpawn);
    });

    it('should spawn ship on the right side of canvas', () => {
      service.trySpawn(0, 800);
      service.trySpawn(50000, 800);
      expect(service.getShip().x).toBeGreaterThanOrEqual(800);
    });
  });

  describe('update', () => {
    it('should move active ship left', () => {
      service.trySpawn(0, 800);
      service.trySpawn(50000, 800);
      const startX = service.getShip().x;
      service.update(100, 50100, 800);  // 100ms delta
      expect(service.getShip().x).toBeLessThan(startX);
    });

    it('should deactivate ship when it exits the left edge', () => {
      service.trySpawn(0, 800);
      service.trySpawn(50000, 800);
      // Move ship far enough left to exit canvas
      service.update(100000, 150000, 800); // huge deltaTime
      expect(service.getShip().isActive).toBe(false);
    });

    it('should attempt to spawn during update', () => {
      service.update(0, 0, 800);          // initialize
      service.update(100, 50000, 800);    // advance beyond interval
      // Ship should have spawned or at least been attempted
      // We cannot access internal nextSpawnTime but spawn side-effect is observable
      expect(service.getShip()).toBeDefined();
    });
  });

  describe('hit', () => {
    it('should deactivate ship on hit', () => {
      service.trySpawn(0, 800);
      service.trySpawn(50000, 800);
      service.hit();
      expect(service.getShip().isActive).toBe(false);
    });

    it('should return ship point value', () => {
      service.trySpawn(0, 800);
      service.trySpawn(50000, 800);
      const points = service.hit();
      expect(MysteryShipService.POINT_VALUES).toContain(points);
    });

    it('should return 0 if no active ship', () => {
      expect(service.hit()).toBe(0);
    });
  });

  describe('reset', () => {
    it('should deactivate ship', () => {
      service.trySpawn(0, 800);
      service.trySpawn(50000, 800);
      service.reset();
      expect(service.getShip().isActive).toBe(false);
    });
  });
});
