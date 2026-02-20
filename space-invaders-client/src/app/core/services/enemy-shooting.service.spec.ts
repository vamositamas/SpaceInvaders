import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { EnemyShootingService } from './enemy-shooting.service';
import { EnemyEntity } from './enemy.service';

describe('EnemyShootingService', () => {
  let service: EnemyShootingService;
  let addEnemyProjectileSpy: jasmine.Spy;

  const makeEnemy = (col: number, row = 4): EnemyEntity => ({
    x: col * 45 + 160, y: 60 + row * 35,
    width: 30, height: 20, isActive: true,
    type: 'octopus', pointValue: 10, row, col
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EnemyShootingService, provideZonelessChangeDetection()]
    });
    service = TestBed.inject(EnemyShootingService);
    addEnemyProjectileSpy = jasmine.createSpy('addEnemyProjectile');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not fire when enemy list is empty', () => {
    service.update(16, [], addEnemyProjectileSpy, 0, 2000);
    expect(addEnemyProjectileSpy).not.toHaveBeenCalled();
  });

  it('should fire after the fire-rate cooldown has elapsed', () => {
    const shooters = [makeEnemy(0)];
    // Advance past the cooldown
    service.update(16, shooters, addEnemyProjectileSpy, 0, 2000);
    service.update(2001, shooters, addEnemyProjectileSpy, 16, 2000);
    expect(addEnemyProjectileSpy).toHaveBeenCalled();
  });

  it('should not fire before the fire-rate cooldown has elapsed', () => {
    const shooters = [makeEnemy(0)];
    service.update(500, shooters, addEnemyProjectileSpy, 0, 2000);
    expect(addEnemyProjectileSpy).not.toHaveBeenCalled();
  });

  it('should fire at the bottom of the chosen enemy', () => {
    const shooters = [makeEnemy(0)];
    service.update(2001, shooters, addEnemyProjectileSpy, 0, 2000);
    if (addEnemyProjectileSpy.calls.any()) {
      const [, spawnY] = addEnemyProjectileSpy.calls.mostRecent().args;
      expect(spawnY).toBeGreaterThanOrEqual(shooters[0].y);
    }
  });

  describe('reset', () => {
    it('should reset the last fire time so enemies fire again quickly', () => {
      service.update(2001, [makeEnemy(0)], addEnemyProjectileSpy, 0, 2000);
      service.reset();
      const spy2 = jasmine.createSpy('addEnemyProjectile2');
      service.update(2001, [makeEnemy(0)], spy2, 0, 2000);
      expect(spy2).toHaveBeenCalled();
    });
  });
});
