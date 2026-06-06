import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { EnemyMovementService } from './enemy-movement.service';
import { EnemyEntity } from './enemy.service';

describe('EnemyMovementService', () => {
  let service: EnemyMovementService;

  const makeEnemy = (x: number, y: number, row = 0, col = 0): EnemyEntity => ({
    x, y, width: 30, height: 20, isActive: true,
    type: 'octopus', pointValue: 10, row, col
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EnemyMovementService, provideZonelessChangeDetection()]
    });
    service = TestBed.inject(EnemyMovementService);
    service.reset();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should move enemies to the right by default', () => {
    const enemy = makeEnemy(100, 100);
    const startX = enemy.x;
    service.update(16, [enemy], 800, 1);
    expect(enemy.x).toBeGreaterThan(startX);
  });

  it('should move enemies using deltaTime (frame-independent)', () => {
    const e1 = makeEnemy(100, 100);
    service.update(32, [e1], 800, 1); // 2× frame
    const moved32 = e1.x - 100;

    const e2 = makeEnemy(100, 100);
    service.reset();
    service.update(16, [e2], 800, 1); // 1× frame
    const moved16 = e2.x - 100;

    expect(moved32).toBeCloseTo(moved16 * 2, 0);
  });

  it('should reverse direction when rightmost enemy reaches right edge', () => {
    // Place enemy near right boundary
    const enemy = makeEnemy(770, 100); // x + width = 800
    service.update(16, [enemy], 800, 100); // large speed to trigger edge
    // Now direction should have reversed — next update moves left
    const xAfterReverse = enemy.x;
    service.update(16, [enemy], 800, 100);
    expect(enemy.x).toBeLessThan(xAfterReverse);
  });

  it('should descend by one step when direction reverses', () => {
    const enemy = makeEnemy(770, 100);
    const startY = enemy.y;
    service.update(16, [enemy], 800, 100);
    expect(enemy.y).toBeGreaterThan(startY);
  });

  it('should reverse direction when leftmost enemy reaches left edge', () => {
    service['direction'] = -1; // force leftward movement
    const enemy = makeEnemy(0, 100);
    service.update(16, [enemy], 800, 100);
    const xAfterReverse = enemy.x;
    service.update(16, [enemy], 800, 100);
    expect(enemy.x).toBeGreaterThan(xAfterReverse);
  });

  it('should skip inactive enemies', () => {
    const enemy = makeEnemy(100, 100);
    enemy.isActive = false;
    const startX = enemy.x;
    service.update(16, [enemy], 800, 1);
    expect(enemy.x).toBe(startX);
  });

  it('should move faster when more enemies are destroyed', () => {
    const enemies = [makeEnemy(100, 100), makeEnemy(200, 100)];
    const baseSpeed = 60;
    const speedFull = service.computeSpeed(2, 2, baseSpeed);    // all alive
    const speedHalf = service.computeSpeed(1, 2, baseSpeed);    // half destroyed
    expect(speedHalf).toBeGreaterThan(speedFull);
  });

  describe('reset', () => {
    it('should restore rightward direction', () => {
      service['direction'] = -1;
      service.reset();
      expect(service['direction'] as number).toBe(1);
    });
  });
});
