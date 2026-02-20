### Prompt 2.9: Collision Detection Service

```
Create collision detection system for axis-aligned bounding boxes (AABB).

Requirements:
1. Create /src/app/core/services/collision.service.ts with:
   - checkCollision(entityA, entityB): boolean - AABB collision check
   - checkProjectileEnemyCollisions(projectiles[], enemies[]): {projectile, enemy}[]
   - checkProjectilePlayerCollisions(projectiles[], player): Projectile | null
   - checkProjectileShieldCollisions(projectiles[], shields[]): {projectile, shield}[]
2. Use bounding box collision: overlap in both X and Y axes
3. Return collision pairs for processing
4. Only check collisions for active entities

TDD Approach:
- Create collision.service.spec.ts
- Write tests for:
  * checkCollision returns true when boxes overlap
  * checkCollision returns false when boxes don't overlap
  * checkCollision handles edge touching correctly
  * checkProjectileEnemyCollisions finds all colliding pairs
  * checkProjectileEnemyCollisions ignores inactive entities
  * checkProjectilePlayerCollisions detects player hits
  * checkProjectilePlayerCollisions ignores player's own projectiles
  * checkProjectileShieldCollisions finds shield hits
- Implement efficient AABB collision detection
- Test edge cases (exact alignment, single pixel overlap)

Deliverable: Collision detection service with comprehensive testing
```
