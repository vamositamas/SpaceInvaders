### Prompt 2.6: Player Entity and Movement

```
Create player ship logic with movement controls and boundaries.

Requirements:
1. Create /src/app/core/services/player.service.ts with:
   - createPlayer(canvasWidth): Player - initializes player at bottom center
   - updatePlayer(player, input, deltaTime, canvasWidth) - updates position based on input
   - canPlayerFire(player, currentTime): boolean - checks fire rate cooldown
   - fireProjectile(player, currentTime): Projectile - creates player projectile
2. Player moves horizontally based on keyboard (A/D or Arrows) or mouse X
3. Player stays within canvas boundaries (0 to canvasWidth - playerWidth)
4. Fire rate limited to once per 500ms

TDD Approach:
- Create player.service.spec.ts
- Write tests for:
  * createPlayer places player at bottom center
  * updatePlayer moves left when ArrowLeft pressed
  * updatePlayer moves right when ArrowRight pressed
  * updatePlayer follows mouse X position when mouse enabled
  * updatePlayer respects left boundary (x >= 0)
  * updatePlayer respects right boundary (x <= canvas width - player width)
  * canPlayerFire returns false if fired recently
  * canPlayerFire returns true after cooldown period
  * fireProjectile creates projectile above player
  * fireProjectile updates player lastFireTime
- Implement player.service.ts to pass all tests
- Use deltaTime for smooth frame-independent movement

Deliverable: Player service with movement and shooting logic
```
