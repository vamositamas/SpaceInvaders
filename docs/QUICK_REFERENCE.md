# Space Invaders - Development Quick Reference

**Version:** 1.0  
**Last Updated:** December 12, 2025

---

## 🚨 CRITICAL RULES - NEVER BREAK THESE

### 1. ZERO TOLERANCE FOR CODE DUPLICATION
- **Duplicated code = Rejected PR**
- If you write the same code twice, STOP and refactor immediately
- Extract shared logic into utilities, services, or base classes
- Use constants for repeated values

### 2. TDD IS MANDATORY
- **Tests FIRST, code SECOND**
- Red → Green → Refactor
- No implementation before tests exist
- Aim for 100% test coverage

### 3. SERVICES FOR LOGIC
- Business logic belongs in services, NOT components
- Components are presentation-only
- Use dependency injection
- Single Responsibility Principle

---

## 📋 Quick Checklist (Before Every Commit)

- [ ] All tests pass (`npm test`)
- [ ] Test coverage ≥ 80% (`npm run test:coverage`)
- [ ] No linting errors (`npm run lint`)
- [ ] **ZERO code duplication**
- [ ] Business logic in services
- [ ] All observables unsubscribed
- [ ] JSDoc comments on public APIs
- [ ] Conventional commit message

---

## 🎮 Game Development Essentials

### Frame-Independent Movement
```typescript
// ✅ ALWAYS use deltaTime
newPosition = position + (velocity * deltaTime);

// ❌ NEVER do this
newPosition = position + velocity;
```

### Object Pooling
```typescript
// ✅ Reuse projectiles from pool
const projectile = projectilePool.acquire();

// ❌ Don't create new every time
const projectile = new Projectile();
```

### Collision Detection
- Use AABB for rectangular entities
- Implement spatial partitioning for > 50 entities
- Skip inactive entities
- Only check relevant entity pairs

---

## 🅰️ Angular Best Practices

### Always Unsubscribe
```typescript
// ✅ GOOD - Using takeUntil
private destroy$ = new Subject<void>();

ngOnInit() {
  this.service.data$
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => { ... });
}

ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}
```

### State Management
```typescript
// ✅ GOOD - Expose observable, not subject
private scoreSubject = new BehaviorSubject<number>(0);
public score$ = this.scoreSubject.asObservable();

// ❌ BAD - Exposing subject
public scoreSubject = new BehaviorSubject<number>(0);
```

### Performance
```typescript
// ✅ Use OnPush when possible
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})

// ✅ Use trackBy in *ngFor
<div *ngFor="let item of items; trackBy: trackById"></div>

trackById(index: number, item: any) {
  return item.id;
}
```

---

## 📊 Performance Targets (MANDATORY)

| Metric | Target | How to Measure |
|--------|--------|----------------|
| FPS | 60 | Chrome DevTools Performance |
| Memory | < 200MB | Chrome DevTools Memory |
| Load Time | < 3s | Lighthouse |
| Input Latency | < 50ms | Chrome DevTools Performance |
| Coverage | ≥ 80% | `npm run test:coverage` |

---

## 🔒 Security Checklist

- [ ] Validate player names (1-20 chars, alphanumeric)
- [ ] Sanitize all user input (prevent XSS)
- [ ] Validate scores against game rules
- [ ] Rate limit API endpoints
- [ ] Use Helmet.js for security headers
- [ ] Configure CORS properly
- [ ] Never trust client-side data
- [ ] Validate duration/score relationships (anti-cheat)

---

## ♿ Accessibility Requirements (WCAG 2.1 AA)

- [ ] All buttons have `aria-label`
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Focus indicators visible
- [ ] Color contrast ≥ 4.5:1
- [ ] Screen reader announces game state
- [ ] High contrast mode supported

---

## 🧪 Testing Commands

```bash
# Run all unit tests
npm test

# Run with coverage report
npm run test:coverage

# Run linting
npm run lint

# Run E2E tests
npm run e2e

# Run specific test file
npm test -- --testPathPattern=player.service.spec
```

---

## 📝 Naming Conventions

### Files
- Services: `player.service.ts`
- Components: `game-canvas.component.ts`
- Models: `game-entities.model.ts`
- Tests: `player.service.spec.ts`
- Utils: `collision.util.ts`

### Code
- Classes/Interfaces: `PascalCase`
- Functions/Methods: `camelCase` (verb-first: `createEnemy`, `updatePlayer`)
- Constants: `UPPER_SNAKE_CASE`
- Booleans: `is`, `has`, `can`, `should` prefix (`isGameOver`, `canFire`)

---

## 🔄 Git Workflow

### Commit Message Format
```
type(scope): description

feat(player): add shooting cooldown mechanism
fix(collision): resolve overlap detection bug
test(enemy): add boundary condition tests
docs(readme): update setup instructions
refactor(projectile): extract velocity calculation
```

### Types
- `feat` - New feature
- `fix` - Bug fix
- `test` - Test additions/changes
- `refactor` - Code restructuring
- `docs` - Documentation
- `style` - Formatting
- `chore` - Maintenance

---

## 📚 File Organization

### Frontend
```
/src/app/
  /core/
    /services/      # Game logic services
    /models/        # TypeScript interfaces
    /utils/         # Pure functions
  /features/        # Feature modules
  /shared/          # Shared components
```

### Backend
```
/src/
  /services/        # Business logic
  /controllers/     # Route handlers
  /routes/          # Express routes
  /middleware/      # Express middleware
  /models/          # Data models
```

---

## 🚫 Common Mistakes to Avoid

### Memory Leaks
```typescript
// ❌ BAD - Memory leak
this.service.data$.subscribe(data => { ... });

// ✅ GOOD - Properly unsubscribed
this.service.data$
  .pipe(takeUntil(this.destroy$))
  .subscribe(data => { ... });
```

### Performance Issues
```typescript
// ❌ BAD - Recalculating every frame
for (let i = 0; i < enemies.length; i++) {
  for (let j = 0; j < projectiles.length; j++) {
    checkCollision(enemies[i], projectiles[j]); // O(n²)
  }
}

// ✅ GOOD - Spatial partitioning
const nearbyEntities = spatialGrid.getNearby(projectile);
nearbyEntities.forEach(entity => checkCollision(projectile, entity));
```

### State Mutations
```typescript
// ❌ BAD - Mutating state
this.enemies.push(newEnemy);

// ✅ GOOD - Immutable update
this.enemies = [...this.enemies, newEnemy];
```

---

## 📖 Documentation Requirements

### JSDoc Example
```typescript
/**
 * Checks collision between two rectangular entities using AABB algorithm.
 * 
 * @param entity1 - First entity with x, y, width, height properties
 * @param entity2 - Second entity with x, y, width, height properties
 * @returns True if entities are overlapping, false otherwise
 * 
 * @example
 * const collision = checkCollision(player, enemy);
 * if (collision) handleCollision();
 */
checkCollision(entity1: Entity, entity2: Entity): boolean {
  // Implementation
}
```

---

## 🎯 Prompt-Driven Development

### Workflow
1. Read the prompt document thoroughly
2. Understand acceptance criteria
3. **Write tests FIRST** (TDD)
4. Implement code to pass tests
5. Refactor (keep tests green)
6. Document the code
7. Verify all acceptance criteria met
8. Mark prompt as complete

### Verification Before Moving On
```bash
# Run full test suite
npm test

# Check coverage
npm run test:coverage

# Run linter
npm run lint

# Manual testing
# Performance profiling
# Accessibility audit
# Cross-browser testing
```

---

## ⚡ Performance Optimization Tips

### 1. Object Pooling
- Use for projectiles (frequently created/destroyed)
- Reuse inactive objects instead of creating new
- Maximum pool size to prevent unlimited growth

### 2. Spatial Partitioning
- Divide game world into grid cells
- Only check collisions in same/adjacent cells
- Reduces O(n²) to O(n) for most cases

### 3. Canvas Rendering
- Use `requestAnimationFrame` correctly
- Batch draw calls when possible
- Only redraw changed areas (if applicable)
- Profile with Chrome DevTools

### 4. Memory Management
- Clean up event listeners in `ngOnDestroy`
- Unsubscribe from all observables
- Remove inactive entities periodically
- Avoid creating new objects every frame

---

## 🆘 When You're Stuck

### 1. Read the Prompt Again
- Ensure you understand all requirements
- Check acceptance criteria
- Verify dependencies are complete

### 2. Check Existing Code
- Look for similar implementations
- Follow existing patterns
- Don't reinvent the wheel

### 3. Review the Development Plan
- Understand the big picture
- See how your task fits in
- Check related prompts

### 4. Run Diagnostics
```bash
npm test                    # Are tests passing?
npm run test:coverage       # Is coverage sufficient?
npm run lint                # Are there linting errors?
git status                  # What files changed?
git diff                    # What are the changes?
```

### 5. Ask for Help
- Provide context (what you're trying to do)
- Share error messages
- Explain what you've tried
- Reference the prompt number

---

## 📌 Key Principles (The 10 Commandments)

1. **TDD is mandatory** - Tests first, always
2. **Zero duplication** - Extract, abstract, reuse
3. **Services for logic** - Keep components thin
4. **Test everything** - Aim for 100% coverage
5. **Profile performance** - Meet the 60 FPS target
6. **Accessibility matters** - WCAG 2.1 AA compliance
7. **Security first** - Validate everything
8. **Document as you go** - Don't leave it for later
9. **Follow prompts sequentially** - Complete before moving on
10. **Code review yourself** - Use the checklist

---

## 🔗 Useful Links

- Full Instructions: `.github/copilot-instructions.md`
- Development Plan: `docs/DEVELOPMENT_PLAN.md`
- Prompts: `docs/prompts/`
- API Docs: `docs/ai documents/API_SERVICE.md`

---

**Remember:** These are requirements, not suggestions. Following them ensures high-quality, maintainable code that meets all project standards.
