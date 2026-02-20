### Prompt 7.1: Performance Optimization

```
Optimize game performance for consistent 60 FPS.

Requirements:
1. Implement object pooling for projectiles:
   - Create /src/app/core/services/object-pool.service.ts
   - Pool projectile objects to avoid garbage collection
   - Reuse inactive projectiles instead of creating new
2. Optimize collision detection:
   - Implement spatial partitioning (grid-based)
   - Only check nearby entities for collisions
   - Skip inactive entities
3. Optimize canvas rendering:
   - Use requestAnimationFrame correctly
   - Only redraw changed areas if possible
   - Batch draw calls

TDD Approach:
- Create object-pool.service.spec.ts:
  * Pool creates initial object set
  * acquire() reuses inactive objects
  * acquire() creates new if pool empty
  * release() returns object to pool
  * Pool size doesn't exceed maximum
- Add performance tests:
  * Measure frame rate with 100+ entities
  * Verify consistent 60 FPS maintained
  * Memory usage stays under 200MB
  * No memory leaks over time
- Implement optimizations
- Profile with browser dev tools
- Verify performance improvements

Deliverable: Optimized game running at 60 FPS
```
