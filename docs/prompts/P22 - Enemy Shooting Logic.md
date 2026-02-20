### Prompt 3.3: Enemy Shooting Logic

```
Create enemy shooting system with random firing from bottom row.

Requirements:
1. Create /src/app/core/services/enemy-shooting.service.ts with:
   - getBottomRowEnemies(enemies[]): Enemy[] - finds lowest active enemies per column
   - canEnemyFire(lastFireTime, currentTime, fireRate): boolean - checks cooldown
   - selectRandomShooter(bottomEnemies[]): Enemy | null - picks random enemy
   - createEnemyProjectile(enemy): Projectile - creates downward projectile
2. Only bottom-most enemy in each column can fire
3. Fire rate: approximately every 2000ms per column
4. Random selection from available shooters
5. Enemy projectiles move downward

TDD Approach:
- Create enemy-shooting.service.spec.ts
- Write tests for:
  * getBottomRowEnemies returns one enemy per column
  * getBottomRowEnemies returns lowest enemy when multiple in column
  * getBottomRowEnemies handles empty columns
  * canEnemyFire returns false if fired too recently
  * canEnemyFire returns true after cooldown period
  * selectRandomShooter returns enemy from provided array
  * selectRandomShooter returns null if array empty
  * createEnemyProjectile creates projectile below enemy
  * createEnemyProjectile sets positive (downward) velocity
- Implement enemy-shooting.service.ts
- Use Math.random() for selection (mock in tests)

Deliverable: Enemy shooting system with random firing
```
