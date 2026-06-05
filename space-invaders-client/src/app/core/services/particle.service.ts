import { Injectable } from '@angular/core';

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;     // Remaining life in seconds
  maxLife: number;  // Initial life in seconds
  isActive: boolean;
}

/**
 * ParticleService - Manages particle arrays and rendering calculations
 * Uses an Object Pool internally to recycle particle instances and prevent GC pauses.
 */
@Injectable({
  providedIn: 'root'
})
export class ParticleService {
  private activeParticles: Particle[] = [];
  private freeParticles: Particle[] = [];

  /**
   * Spawn a burst of explosion particles at (x, y)
   * @param x       Spawn X coordinate
   * @param y       Spawn Y coordinate
   * @param color   Base particle color
   * @param count   Number of particles to spawn (default 15)
   */
  spawnExplosion(x: number, y: number, color: string, count = 15): void {
    for (let i = 0; i < count; i++) {
      // Random angle and speed
      const angle = Math.random() * Math.PI * 2;
      const speed = 50 + Math.random() * 100; // px/s
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;

      const size = 1.5 + Math.random() * 2.5; // Random size between 1.5 and 4.0 px
      const maxLife = 0.3 + Math.random() * 0.4; // Lifespan between 0.3 and 0.7 seconds

      this.spawnParticle(x, y, vx, vy, size, color, maxLife);
    }
  }

  /**
   * Helper that checks out or instantiates a particle and pushes it to activeParticles.
   */
  private spawnParticle(x: number, y: number, vx: number, vy: number, size: number, color: string, maxLife: number): void {
    if (this.freeParticles.length > 0) {
      const p = this.freeParticles.pop()!;
      p.x = x;
      p.y = y;
      p.vx = vx;
      p.vy = vy;
      p.size = size;
      p.color = color;
      p.life = maxLife;
      p.maxLife = maxLife;
      p.isActive = true;
      this.activeParticles.push(p);
    } else {
      this.activeParticles.push({
        x,
        y,
        vx,
        vy,
        size,
        color,
        life: maxLife,
        maxLife,
        isActive: true
      });
    }
  }

  /**
   * Update all particle positions and lifespans.
   * Recycles dead particles into the free pool.
   * @param deltaTime Time elapsed since last frame in milliseconds
   */
  update(deltaTime: number): void {
    const dt = deltaTime / 1000;

    for (const p of this.activeParticles) {
      if (!p.isActive) continue;

      p.x += p.vx * dt;
      p.y += p.vy * dt;
      
      // Decay velocity slightly due to drag
      p.vx *= 0.95;
      p.vy *= 0.95;

      p.life -= dt;
      if (p.life <= 0) {
        p.isActive = false;
      }
    }

    // Collect newly deactivated particles into the free pool
    for (const p of this.activeParticles) {
      if (!p.isActive) {
        this.freeParticles.push(p);
      }
    }

    // Filter out inactive entries
    this.activeParticles = this.activeParticles.filter(p => p.isActive);
  }

  /** Retrieve current active particles list */
  getParticles(): Particle[] {
    return this.activeParticles;
  }

  /** Deactivate and clear all particles */
  clear(): void {
    for (const p of this.activeParticles) {
      p.isActive = false;
      this.freeParticles.push(p);
    }
    this.activeParticles = [];
  }
}
