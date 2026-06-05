import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ParticleService } from './particle.service';

describe('ParticleService', () => {
  let service: ParticleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ParticleService,
        provideZonelessChangeDetection()
      ]
    });
    service = TestBed.inject(ParticleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should spawn explosion particles', () => {
    service.spawnExplosion(100, 100, '#FF0000', 10);
    expect(service.getParticles().length).toBe(10);

    const first = service.getParticles()[0];
    expect(first.x).toBe(100);
    expect(first.y).toBe(100);
    expect(first.color).toBe('#FF0000');
    expect(first.isActive).toBe(true);
  });

  it('should update particles and apply drag velocity decays', () => {
    service.spawnExplosion(100, 100, '#00FF00', 5);
    const first = service.getParticles()[0];
    const initialVx = first.vx;
    const initialVy = first.vy;

    service.update(100); // 100ms update
    
    expect(first.x).not.toBe(100);
    expect(first.y).not.toBe(100);
    expect(first.vx).toBeLessThan(initialVx === 0 ? 1 : Math.abs(initialVx));
    expect(first.vy).toBeLessThan(initialVy === 0 ? 1 : Math.abs(initialVy));
  });

  it('should recycle particles after they die', () => {
    service.spawnExplosion(100, 100, '#0000FF', 2);
    expect(service.getParticles().length).toBe(2);

    // Update with 10000ms (10 seconds) to ensure they exceed lifespans
    service.update(10000);

    expect(service.getParticles().length).toBe(0);
    
    // Now spawn again, it should reuse the objects
    service.spawnExplosion(200, 200, '#FFFF00', 2);
    expect(service.getParticles().length).toBe(2);
  });

  it('should clear particles correctly', () => {
    service.spawnExplosion(100, 100, '#FFFFFF', 5);
    expect(service.getParticles().length).toBe(5);

    service.clear();
    expect(service.getParticles().length).toBe(0);
  });
});
