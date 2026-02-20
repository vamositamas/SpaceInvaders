### Prompt 4.1: Shield Entity System

```
Create destructible shield/barrier system with health tracking.

Requirements:
1. Create /src/app/core/services/shield.service.ts with:
   - createShields(count, canvasWidth, playerY): Shield[] - creates 4 shields
   - damageShield(shield, damage): Shield - reduces health
   - isShieldDestroyed(shield): boolean - checks if health <= 0
   - removeDestroyedShields(shields[]): Shield[] - filters destroyed
2. Shields positioned between player and enemies
3. Each shield has health (e.g., 100 points)
4. Damage from projectiles reduces health by 10
5. Shield becomes inactive when health reaches 0

TDD Approach:
- Create shield.service.spec.ts
- Write tests for:
  * createShields returns 4 shields
  * Shields evenly spaced across canvas width
  * Shields positioned above player but below enemies
  * damageShield reduces health by damage amount
  * damageShield doesn't reduce health below 0
  * isShieldDestroyed returns true when health = 0
  * isShieldDestroyed returns false when health > 0
  * removeDestroyedShields filters shields with health <= 0
  * Active shields remain after filtering
- Implement shield.service.ts
- Position shields at appropriate Y coordinate

Deliverable: Shield system with health and destruction
```
