### Prompt 2.8: Projectile System

```
Create projectile management system for player and enemy bullets.

Requirements:
1. Create /src/app/core/services/projectile.service.ts with:
   - createProjectile(x, y, velocityY, ownerId): Projectile
   - updateProjectiles(projectiles[], deltaTime, canvasHeight): Projectile[] - moves and filters
   - removeInactiveProjectiles(projectiles[]): Projectile[] - filters out-of-bounds
2. Projectiles move vertically at constant speed
3. Player projectiles move up (negative velocity)
4. Enemy projectiles move down (positive velocity)
5. Remove projectiles that go off-screen

TDD Approach:
- Create projectile.service.spec.ts
- Write tests for:
  * createProjectile returns Projectile with correct properties
  * updateProjectiles moves projectile by velocity * deltaTime
  * Player projectile (negative velocity) moves upward
  * Enemy projectile (positive velocity) moves downward
  * removeInactiveProjectiles filters projectiles above canvas (y < 0)
  * removeInactiveProjectiles filters projectiles below canvas (y > height)
  * Active projectiles remain in array
- Implement projectile.service.ts
- Use frame-independent movement with deltaTime

Deliverable: Projectile system with physics and cleanup
```
