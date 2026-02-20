### Prompt 9.1: Power-Up System

```
Add power-up system with collectible bonuses (optional enhancement).

Requirements:
1. Create /src/app/core/services/powerup.service.ts with:
   - createPowerUp(type, x, y): PowerUp - creates power-up entity
   - updatePowerUps(powerups[], deltaTime): PowerUp[] - moves power-ups
   - applyPowerUp(player, type): Player - applies effect
2. Power-up types:
   - RAPID_FIRE: Increases fire rate for 10 seconds
   - SHIELD: Adds temporary shield
   - MULTI_SHOT: Shoots 3 projectiles at once
   - EXTRA_LIFE: Adds one life
3. Power-ups drop randomly from destroyed enemies (5% chance)
4. Power-ups fall downward slowly
5. Collect by touching with player ship

TDD Approach:
- Create powerup.service.spec.ts:
  * createPowerUp generates power-up at position
  * updatePowerUps moves power-ups downward
  * Power-ups removed when off-screen
  * applyPowerUp applies correct effect
  * RAPID_FIRE reduces fire cooldown
  * SHIELD adds temporary invincibility
  * MULTI_SHOT changes shooting pattern
  * EXTRA_LIFE increases lives by 1
  * Power-up effects expire after duration
- Implement power-up system
- Add visual indicators for active power-ups
- Test power-up collection and effects

Deliverable: Power-up system with multiple types
```
