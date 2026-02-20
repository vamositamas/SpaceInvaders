# Game Engine Implementation — Complete

## Summary

This document covers the full game engine implementation that makes Space Invaders playable. All services were implemented following strict TDD (tests written first, then implementation).

## Services Created

### ShieldService (`shield.service.ts`)
- 4 shields positioned evenly between player and enemy rows
- Shield dimensions: 60×40px, 100 health points
- `DAMAGE_PER_HIT = 10`, deactivates at 0 health
- Y position: `canvasHeight - 150`
- `initShields(w, h)`, `damageShield(shield)`, `getActiveShields()`

### ScoreService (`score.service.ts`)
- Combo-multiplier scoring system
- 1000ms combo window: 3+ hits = 1.5×, 5+ hits = 2×
- `addPoints(pts, currentTime)`, `getScore()`, `getComboCount()`, `reset()`

### MysteryShipService (`mystery-ship.service.ts`)
- Spawns every 20–40 seconds from the right edge
- Moves left at 150 px/s, deactivates when off-screen
- Random point value from `[50, 100, 150, 200, 250, 300]`
- `update(dt, now, w)`, `hit()` → returns point value, `reset()`

## GameBoardComponent Rewrite

The component was fully refactored from a stub to a complete playable game:

### Loop Architecture
- `startGameLoop()` passes `timestamp` to inner loop; `deltaTime = min(ts - last, 100ms)` 
- `update(dt, ts)` — game logic, skipped when paused or game over
- `render(ts)` — canvas drawing, runs every frame (enables pause overlay)

### Update Logic
1. Pause input (P / Escape — single press toggle)
2. Player movement + firing (Space / left-click)
3. Projectile movement + culling
4. Enemy formation movement
5. Enemy shooting (level-scaled fire rate)
6. Mystery ship update
7. Collision resolution:
   - Player projectiles vs enemies
   - Player projectiles vs shields
   - Player projectiles vs mystery ship
   - Enemy projectiles vs shields
   - Enemy projectiles vs player
   - Enemies reaching bottom → game over
   - All enemies destroyed → level up

### Render Logic
- Black background
- Shields (green, intensity = health%)
- Mystery ship (red) with point label
- Enemies: squid=`#00FFFF`, crab=`#FFFFFF`, octopus=`#FF00FF`
- Player (green, flickers at 100ms intervals during invincibility)
- Enemy projectiles (orange)
- Player projectiles (yellow)
- Pause overlay (semi-transparent + "PAUSED" text)

### Service Injections
All 13 services injected: CanvasService, ConfigService, GameStateService, InputHandlerService, PlayerService, ProjectileService, CollisionService, EnemyService, EnemyMovementService, EnemyShootingService, LevelService, ShieldService, ScoreService, MysteryShipService.

## Bug Fix

`HighScoreService.loadHighScores()` — added `highScoresSubject.next([])` inside `catchError` so cache is cleared on API error (test was written correctly, implementation was incomplete).

## Test Results

**537 / 537 tests passing** (0 failures)

Previous session: 408/408. New tests added this session: 129.
