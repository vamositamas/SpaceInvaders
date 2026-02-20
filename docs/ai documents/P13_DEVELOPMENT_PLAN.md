# P13 Development Plan: Game Loop Service

## Overview
Create a game loop service using `requestAnimationFrame` to run at 60 FPS with delta time calculation and FPS tracking, following strict TDD methodology.

---

## Phase 1: RED - Write Tests First

### 1.1 Setup Test File
**File:** `/src/app/core/services/game-loop.service.spec.ts`

**Test Structure:**
```typescript
describe('GameLoopService', () => {
  // Setup
  - Mock requestAnimationFrame
  - Mock cancelAnimationFrame
  - Mock performance.now()
  - Use jasmine.clock() for time control
  
  // Test groups
  describe('Service Creation')
  describe('start()')
  describe('stop()')
  describe('pause()')
  describe('resume()')
  describe('getDeltaTime()')
  describe('getFPS()')
  describe('Frame Rate Control')
  describe('Error Handling')
});
```

### 1.2 Test Cases to Write

#### Service Creation (3 tests)
1. ✅ Should be created
2. ✅ Should have default state (not running, not paused)
3. ✅ Should initialize with zero delta time and FPS

#### start() Method (8 tests)
1. ✅ Should start the game loop
2. ✅ Should call updateCallback on each frame
3. ✅ Should use requestAnimationFrame
4. ✅ Should calculate delta time between frames
5. ✅ Should not start if already running
6. ✅ Should throw error if no callback provided
7. ✅ Should set isRunning to true
8. ✅ Should reset pause state

#### stop() Method (6 tests)
1. ✅ Should stop the game loop
2. ✅ Should cancel animation frame
3. ✅ Should set isRunning to false
4. ✅ Should stop calling updateCallback
5. ✅ Should be safe to call when not running
6. ✅ Should reset FPS and delta time

#### pause() Method (5 tests)
1. ✅ Should pause the game loop
2. ✅ Should set isPaused to true
3. ✅ Should stop calling updateCallback
4. ✅ Should NOT cancel animation frame
5. ✅ Should be idempotent (safe to call multiple times)

#### resume() Method (5 tests)
1. ✅ Should resume the game loop
2. ✅ Should set isPaused to false
3. ✅ Should resume calling updateCallback
4. ✅ Should recalculate delta time correctly
5. ✅ Should do nothing if not paused

#### getDeltaTime() Method (4 tests)
1. ✅ Should return milliseconds since last frame
2. ✅ Should return 0 initially
3. ✅ Should update after each frame
4. ✅ Should return approximate 16.67ms at 60 FPS

#### getFPS() Method (5 tests)
1. ✅ Should return current frames per second
2. ✅ Should return 0 initially
3. ✅ Should calculate FPS from delta time
4. ✅ Should return approximately 60 at target rate
5. ✅ Should smooth FPS over multiple frames

#### Frame Rate Control (4 tests)
1. ✅ Should target 60 FPS
2. ✅ Should handle variable frame rates
3. ✅ Should cap delta time to prevent spiral of death
4. ✅ Should maintain consistent timing

#### Error Handling (3 tests)
1. ✅ Should handle missing callback gracefully
2. ✅ Should handle callback errors without crashing
3. ✅ Should continue loop after callback error

**Total Tests: ~43 tests**

---

## Phase 2: GREEN - Implement Service

### 2.1 Create Service File
**File:** `/src/app/core/services/game-loop.service.ts`

**Service Structure:**
```typescript
@Injectable({
  providedIn: 'root'
})
export class GameLoopService {
  // Private properties
  private animationFrameId: number | null = null;
  private lastFrameTime: number = 0;
  private deltaTime: number = 0;
  private fps: number = 0;
  private isRunning: boolean = false;
  private isPaused: boolean = false;
  private updateCallback: ((deltaTime: number) => void) | null = null;
  
  // FPS calculation
  private fpsFrames: number[] = [];
  private readonly FPS_SAMPLE_SIZE = 60;
  private readonly MAX_DELTA_TIME = 100; // Cap at 100ms
  
  // Public methods
  start(updateCallback: (deltaTime: number) => void): void
  stop(): void
  pause(): void
  resume(): void
  getDeltaTime(): number
  getFPS(): number
  isLoopRunning(): boolean
  isLoopPaused(): boolean
  
  // Private methods
  private gameLoop(currentTime: number): void
  private calculateFPS(): void
  private resetStats(): void
}
```

### 2.2 Implementation Steps

#### Step 1: Basic Structure
- Create injectable service
- Add private properties for state
- Add public method signatures

#### Step 2: start() Method
```typescript
start(updateCallback: (deltaTime: number) => void): void {
  if (!updateCallback) {
    throw new Error('Update callback is required');
  }
  if (this.isRunning) {
    return; // Already running
  }
  
  this.updateCallback = updateCallback;
  this.isRunning = true;
  this.isPaused = false;
  this.lastFrameTime = performance.now();
  this.gameLoop(this.lastFrameTime);
}
```

#### Step 3: gameLoop() Method
```typescript
private gameLoop(currentTime: number): void {
  if (!this.isRunning) {
    return;
  }
  
  // Calculate delta time
  this.deltaTime = currentTime - this.lastFrameTime;
  this.lastFrameTime = currentTime;
  
  // Cap delta time to prevent spiral of death
  if (this.deltaTime > this.MAX_DELTA_TIME) {
    this.deltaTime = this.MAX_DELTA_TIME;
  }
  
  // Calculate FPS
  this.calculateFPS();
  
  // Call update callback if not paused
  if (!this.isPaused && this.updateCallback) {
    try {
      this.updateCallback(this.deltaTime);
    } catch (error) {
      console.error('Error in game loop callback:', error);
    }
  }
  
  // Request next frame
  this.animationFrameId = requestAnimationFrame((time) => this.gameLoop(time));
}
```

#### Step 4: stop() Method
```typescript
stop(): void {
  if (this.animationFrameId !== null) {
    cancelAnimationFrame(this.animationFrameId);
    this.animationFrameId = null;
  }
  
  this.isRunning = false;
  this.isPaused = false;
  this.resetStats();
}
```

#### Step 5: pause() and resume() Methods
```typescript
pause(): void {
  if (!this.isRunning) {
    return;
  }
  this.isPaused = true;
}

resume(): void {
  if (!this.isRunning || !this.isPaused) {
    return;
  }
  this.isPaused = false;
  this.lastFrameTime = performance.now(); // Reset to prevent large delta
}
```

#### Step 6: Getters and Utilities
```typescript
getDeltaTime(): number {
  return this.deltaTime;
}

getFPS(): number {
  return this.fps;
}

isLoopRunning(): boolean {
  return this.isRunning;
}

isLoopPaused(): boolean {
  return this.isPaused;
}

private calculateFPS(): void {
  if (this.deltaTime > 0) {
    const currentFps = 1000 / this.deltaTime;
    this.fpsFrames.push(currentFps);
    
    if (this.fpsFrames.length > this.FPS_SAMPLE_SIZE) {
      this.fpsFrames.shift();
    }
    
    // Average FPS over sample
    const sum = this.fpsFrames.reduce((a, b) => a + b, 0);
    this.fps = Math.round(sum / this.fpsFrames.length);
  }
}

private resetStats(): void {
  this.deltaTime = 0;
  this.fps = 0;
  this.fpsFrames = [];
  this.lastFrameTime = 0;
}
```

---

## Phase 3: REFACTOR - Improve Code Quality

### 3.1 Add JSDoc Documentation
- Document all public methods
- Add parameter descriptions
- Add return type descriptions
- Include usage examples

### 3.2 Add TypeScript Strict Mode Compliance
- Ensure no implicit any
- All parameters typed
- All return types specified
- Strict null checks

### 3.3 Add Constants
```typescript
private readonly TARGET_FPS = 60;
private readonly TARGET_FRAME_TIME = 1000 / 60; // ~16.67ms
private readonly FPS_SAMPLE_SIZE = 60;
private readonly MAX_DELTA_TIME = 100; // Prevent spiral of death
```

### 3.4 Improve Error Handling
- Validate callback function
- Handle missing requestAnimationFrame
- Add error recovery
- Log errors appropriately

### 3.5 Add Observable Support (Optional Enhancement)
```typescript
private fpsSubject = new BehaviorSubject<number>(0);
public fps$ = this.fpsSubject.asObservable();

private deltaTimeSubject = new BehaviorSubject<number>(0);
public deltaTime$ = this.deltaTimeSubject.asObservable();
```

---

## Phase 4: DOCUMENT

### 4.1 Create Implementation Summary
**File:** `/docs/ai documents/P13_IMPLEMENTATION_SUMMARY.md`

**Contents:**
- Overview
- TDD phases breakdown
- Implementation details
- Test results
- Code quality metrics
- Architecture decisions
- Performance characteristics

### 4.2 Create Completion Document
**File:** `/docs/ai documents/P13_COMPLETE.md`

**Contents:**
- Deliverables checklist
- Test results summary
- Files created/modified
- Integration points
- Next steps

### 4.3 Create Quick Reference
**File:** `/docs/ai documents/P13_QUICK_REFERENCE.md`

**Contents:**
- API reference
- Usage examples
- Common patterns
- Performance tips

### 4.4 Update Project Status
**File:** `/docs/ai documents/PROJECT_STATUS.md`

**Updates:**
- Add P13 to completed phases
- Update test counts
- Update progress percentage
- Update next phase

---

## Testing Strategy

### Mock Setup
```typescript
beforeEach(() => {
  // Mock requestAnimationFrame
  let frameId = 0;
  spyOn(window, 'requestAnimationFrame').and.callFake((callback) => {
    frameId++;
    setTimeout(() => callback(performance.now()), 16);
    return frameId;
  });
  
  // Mock cancelAnimationFrame
  spyOn(window, 'cancelAnimationFrame').and.stub();
  
  // Use jasmine clock
  jasmine.clock().install();
});

afterEach(() => {
  jasmine.clock().uninstall();
});
```

### Time-based Testing
```typescript
it('should call updateCallback at 60 FPS', (done) => {
  let callCount = 0;
  const callback = () => callCount++;
  
  service.start(callback);
  
  // Advance time by 1 second (60 frames)
  jasmine.clock().tick(1000);
  
  expect(callCount).toBeCloseTo(60, 5);
  done();
});
```

---

## File Structure

```
src/app/core/services/
├── game-loop.service.ts           (New - Implementation)
├── game-loop.service.spec.ts      (New - Tests)
└── index.ts                       (Update - Add export)

docs/ai documents/
├── P13_DEVELOPMENT_PLAN.md        (This file)
├── P13_IMPLEMENTATION_SUMMARY.md  (Create after implementation)
├── P13_COMPLETE.md                (Create after implementation)
├── P13_QUICK_REFERENCE.md         (Create after implementation)
└── PROJECT_STATUS.md              (Update after completion)
```

---

## Success Criteria

### Code Quality
- ✅ All ~43 tests passing
- ✅ 100% code coverage
- ✅ TypeScript strict mode compliant
- ✅ No linting errors
- ✅ Comprehensive JSDoc comments

### Functionality
- ✅ Maintains 60 FPS target
- ✅ Accurate delta time calculation
- ✅ FPS tracking works correctly
- ✅ Pause/resume functions properly
- ✅ Stop cleans up resources
- ✅ Error handling works

### Performance
- ✅ Minimal overhead per frame
- ✅ No memory leaks
- ✅ Efficient FPS calculation
- ✅ Smooth frame timing

### Integration
- ✅ Ready for game state updates
- ✅ Ready for entity updates
- ✅ Ready for rendering pipeline
- ✅ Works with existing services

---

## Timeline Estimate

1. **RED Phase**: Write all tests (~60 minutes)
   - Setup mocks and utilities
   - Write 43 comprehensive tests
   - Verify all tests fail

2. **GREEN Phase**: Implement service (~45 minutes)
   - Create service file
   - Implement methods step by step
   - Make all tests pass

3. **REFACTOR Phase**: Improve quality (~30 minutes)
   - Add documentation
   - Improve error handling
   - Add constants
   - Optimize performance

4. **DOCUMENT Phase**: Create documentation (~45 minutes)
   - Implementation summary
   - Completion report
   - Quick reference
   - Update project status

**Total Estimated Time: ~3 hours**

---

## Potential Challenges

### Challenge 1: Testing requestAnimationFrame
**Solution:** Mock RAF and use jasmine.clock() for time control

### Challenge 2: Accurate FPS Calculation
**Solution:** Use rolling average over 60 frames

### Challenge 3: Delta Time Spikes
**Solution:** Cap delta time at MAX_DELTA_TIME (100ms)

### Challenge 4: Pause/Resume Timing
**Solution:** Reset lastFrameTime on resume to prevent large delta

### Challenge 5: Memory Leaks
**Solution:** Properly cleanup animation frame on stop/destroy

---

## Dependencies

### Required
- Angular core (Injectable)
- RxJS (for optional observables)
- Jasmine/Karma (testing)
- TypeScript 5.x

### Browser APIs
- `requestAnimationFrame`
- `cancelAnimationFrame`
- `performance.now()`

---

## Integration Points

### Current Integration
- Will be used by game components
- Will integrate with GameState model
- Will coordinate with CanvasService

### Future Integration (Next Phases)
- Entity update system
- Collision detection
- Player input handling
- Enemy AI
- Rendering pipeline

---

## Notes

### Design Decisions
1. **Service vs Component**: Service allows reuse across components
2. **Delta Time**: Enables frame-independent movement
3. **FPS Smoothing**: Rolling average prevents jittery display
4. **Cap Delta Time**: Prevents spiral of death on lag spikes
5. **Separate Pause/Stop**: Allows pause without cleanup

### Best Practices
- Use dependency injection
- Follow Angular style guide
- Maintain single responsibility
- Use TypeScript features
- Comprehensive error handling

---

## Post-Implementation Checklist

- [x] All tests written and passing (43/43)
- [x] Code coverage at 100%
- [x] TypeScript strict mode compliant
- [x] No linting errors
- [x] JSDoc comments complete
- [x] Service exported from barrel
- [x] Implementation summary created
- [x] Completion document created
- [x] Quick reference created
- [x] PROJECT_STATUS.md updated
- [x] No regression in existing tests
- [x] Performance validated
- [x] Ready for P14 integration

---

**Status:** ✅ COMPLETE  
**Methodology:** Test-Driven Development (TDD)  
**Target:** 100% Test Coverage  
**Timeline:** ~3 hours  

🎮 Game loop successfully built and ready! 🚀
