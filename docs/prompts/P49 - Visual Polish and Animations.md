### Prompt 7.2: Visual Polish and Animations

```
Add visual polish with animations and effects.

Requirements:
1. Create /src/app/core/services/particle.service.ts for particle effects:
   - createExplosion(x, y, color): Particle[] - enemy destruction
   - updateParticles(particles[], deltaTime): Particle[] - animate
   - renderParticles(particles[], canvas): void - draw
2. Add animations to game entities:
   - Enemy explosion animation on death
   - Projectile trail effect
   - Shield damage flash effect
   - Player invincibility flicker
3. Add Angular animations to UI components:
   - Menu button hover effects
   - Dialog slide-in animations
   - Score number count-up animation
   - Level transition fade effect

TDD Approach:
- Create particle.service.spec.ts:
  * createExplosion generates multiple particles
  * Particles have velocity and lifetime
  * updateParticles moves particles by velocity
  * Particles removed after lifetime expires
  * renderParticles draws each particle
- Add visual regression tests:
  * Explosion effect appears on enemy death
  * Shield flashes white when damaged
  * Player flickers during invincibility
- Implement particle system
- Add CSS/Angular animations
- Verify smooth 60 FPS maintained

Deliverable: Polished visuals with particle effects
```
