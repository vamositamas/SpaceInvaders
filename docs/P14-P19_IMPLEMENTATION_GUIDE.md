# Phase 2 Implementation Guide - Quick Reference

**For:** Continuing Phase 2 (P14-P19) Implementation  
**Date:** December 12, 2025

---

## Current Status

### ✅ Completed
- **P14 - Input Handler Service** (100% implemented)
  - Files created: `input-handler.service.ts`, `input-handler.service.spec.ts`
  - Status: Implementation complete, tests need Zone.js fix

### 🔄 Ready to Implement
- **P15 - Player Service**
- **P16 - Game Canvas Component**  
- **P17 - Projectile Service**
- **P18 - Collision Service**
- **P19 - Integration**

---

## TDD Workflow Reminder

For each prompt (P15-P19), follow this exact order:

### 1. RED Phase - Write Tests First
```bash
# Create test file first
touch src/app/core/services/player.service.spec.ts

# Write ALL tests before any implementation
# Cover all acceptance criteria
# Include edge cases
```

### 2. Run Tests (Should FAIL)
```bash
cd space-invaders-client
npm test -- --include='**/player.service.spec.ts' --no-watch
# Tests should fail because implementation doesn't exist yet
```

### 3. GREEN Phase - Implement Code
```bash
# Create implementation file
touch src/app/core/services/player.service.ts

# Write MINIMAL code to make tests pass
# Follow existing patterns
```

### 4. Run Tests (Should PASS)
```bash
npm test -- --include='**/player.service.spec.ts' --no-watch --code-coverage
# All tests should pass
# Coverage should be 100%
```

### 5. REFACTOR Phase
- Improve code quality
- Remove duplication
- Optimize performance
- Keep tests green

### 6. Document
- Add JSDoc comments
- Update implementation summary
- Document any architectural decisions

---

## Fix Zone.js Issue First

Before continuing, fix the Zone.js configuration:

### Option 1: Add Zone.js for Testing
```bash
cd space-invaders-client
npm install zone.js --save-dev
```

Then update `src/polyfills.ts` (or create it):
```typescript
import 'zone.js';
import 'zone.js/testing';
```

### Option 2: Configure Zoneless Testing
Update `karma.conf.js` or test setup to work without Zone.js.

---

## P15 - Player Service Implementation Steps

### Step 1: Create Model
```bash
touch src/app/core/models/player.model.ts
```

Add content:
```typescript
export interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  velocity: number;
  color: string;
  canFire: boolean;
  lastFireTime: number;
}

export const PLAYER_CONFIG = {
  WIDTH: 40,
  HEIGHT: 30,
  VELOCITY: 300,
  FIRE_COOLDOWN: 500,
  COLOR: '#00FF00'
};
```

### Step 2: Write Tests
```bash
touch src/app/core/services/player.service.spec.ts
```

Key tests to write:
```typescript
describe('PlayerService', () => {
  // Creation
  it('should create player with correct initial properties');
  it('should position player at bottom center of canvas');
  
  // Keyboard movement
  it('should move player left when ArrowLeft pressed');
  it('should move player right when ArrowRight pressed');
  it('should use deltaTime for movement');
  
  // Mouse movement
  it('should follow mouse X position');
  
  // Boundaries
  it('should not move beyond left boundary');
  it('should not move beyond right boundary');
  
  // Fire cooldown
  it('should allow firing when cooldown expired');
  it('should prevent firing during cooldown');
});
```

### Step 3: Implement Service
```bash
touch src/app/core/services/player.service.ts
```

Key methods:
```typescript
@Injectable({ providedIn: 'root' })
export class PlayerService {
  constructor(private inputHandler: InputHandlerService) {}
  
  createPlayer(width: number, height: number): Player { }
  update(deltaTime: number): void { }
  getPlayer(): Player | null { }
  canPlayerFire(): boolean { }
  recordFire(): void { }
}
```

### Step 4: Verify
```bash
npm test -- --include='**/player.service.spec.ts' --no-watch --code-coverage
```

Expected:
- All tests pass
- Coverage: 100%

---

## P16 - Game Canvas Component Steps

### Step 1: Create Component
```bash
ng generate component features/game/game-canvas --standalone
```

### Step 2: Write Tests First
- Test component initialization
- Test canvas setup
- Test game loop integration
- Test rendering
- Test cleanup

### Step 3: Implement Component
- Initialize canvas context
- Set up game loop
- Integrate input handler
- Integrate player service
- Render player

### Step 4: Verify
```bash
npm test -- --include='**/game-canvas.component.spec.ts' --no-watch --code-coverage
```

---

## P17 - Projectile System Steps

### Step 1: Create Model
```typescript
// src/app/core/models/projectile.model.ts
export interface Projectile {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  velocity: number;
  type: ProjectileType;
  active: boolean;
  color: string;
}
```

### Step 2: Write Tests
- Test projectile creation
- Test projectile movement
- Test off-screen cleanup
- Test player vs enemy projectiles

### Step 3: Implement Service
```typescript
@Injectable({ providedIn: 'root' })
export class ProjectileService {
  createProjectile(x: number, y: number, type: ProjectileType): Projectile { }
  update(deltaTime: number, canvasHeight: number): void { }
  getActiveProjectiles(): Projectile[] { }
  removeProjectile(id: string): void { }
}
```

---

## P18 - Collision Detection Steps

### Step 1: Write Tests
- Test AABB algorithm
- Test projectile-enemy collisions
- Test projectile-player collisions
- Test edge cases (overlap, touching)

### Step 2: Implement Service
```typescript
@Injectable({ providedIn: 'root' })
export class CollisionService {
  checkCollision(entity1: Collidable, entity2: Collidable): boolean { }
  checkProjectileCollisions(projectiles, entities, callback): void { }
}
```

---

## P19 - Integration Steps

### Step 1: Update Game Canvas Component
- Add projectile firing logic
- Integrate collision detection
- Add visual feedback

### Step 2: Write Integration Tests
- Test player shooting
- Test cooldown enforcement
- Test collision detection
- Test projectile removal

### Step 3: End-to-End Verification
- Manual testing
- Performance testing (60 FPS)
- Memory leak testing

---

## Commands Reference

### Run Specific Test File
```bash
npm test -- --include='**/service-name.service.spec.ts' --no-watch
```

### Run Tests with Coverage
```bash
npm test -- --include='**/service-name.service.spec.ts' --no-watch --code-coverage
```

### Run All Tests
```bash
npm test -- --no-watch
```

### Run Linter
```bash
npm run lint
```

### Build Project
```bash
npm run build
```

### Serve Development
```bash
npm start
```

---

## Checklist Per Prompt

Before marking a prompt complete:

- [ ] All tests written BEFORE implementation
- [ ] All tests pass
- [ ] Test coverage ≥ 100%
- [ ] No linting errors
- [ ] JSDoc comments on public APIs
- [ ] No code duplication
- [ ] Frame-independent movement (uses deltaTime)
- [ ] Proper cleanup in ngOnDestroy
- [ ] Observable unsubscriptions handled
- [ ] Manual testing completed
- [ ] Acceptance criteria verified
- [ ] Implementation summary updated

---

## Performance Targets

- **FPS:** Maintain 60 FPS consistently
- **Memory:** Under 200MB
- **Input Latency:** Under 50ms
- **Test Coverage:** 100% on new code

---

## Architecture Reminders

### Service-Based Architecture
- ALL business logic in services
- Components are presentation-only
- Use dependency injection
- Single Responsibility Principle

### No Code Duplication
- Extract shared logic to utilities
- Use constants for repeated values
- Compose behavior from services

### Frame-Independent Movement
```typescript
// ✅ ALWAYS
newX = x + (velocity * deltaTime);

// ❌ NEVER
newX = x + velocity;
```

---

## Resources

- Development Plan: `docs/DEVELOPMENT_PLAN.md`
- Copilot Instructions: `.github/copilot-instructions.md`
- Phase 2 Summary: `docs/ai documents/P14-P19_PHASE2_IMPLEMENTATION_SUMMARY.md`
- Prompt Files: `docs/prompts/P14 - *.md` through `P19 - *.md`

---

## Quick Wins

1. Fix Zone.js configuration first
2. Verify P14 tests pass
3. Implement P15 following TDD strictly
4. Build momentum with small, complete steps
5. Don't skip ahead - finish each prompt 100%

---

**Remember:** TDD is not optional. Tests first, always. No exceptions.

**Good luck!** 🚀
