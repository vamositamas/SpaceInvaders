### Prompt 8.6: Performance Benchmarking Tests

```
Create performance benchmark tests to verify requirements.

Requirements:
1. Create /tests/performance/frame-rate.test.js:
   - Measure FPS during gameplay
   - Test with maximum entities on screen
   - Verify consistent 60 FPS
   - Test on different hardware profiles
2. Create /tests/performance/load-time.test.js:
   - Measure initial page load
   - Measure asset loading time
   - Verify < 3 second load time
3. Create /tests/performance/memory.test.js:
   - Track memory usage over time
   - Play game for extended session
   - Verify no memory leaks
   - Ensure < 200MB memory usage
4. Create /tests/performance/input-latency.test.js:
   - Measure input to response time
   - Verify < 50ms latency
5. Use Performance API and Lighthouse

TDD Approach:
- Create performance test suite:
  * Run game for 5 minutes
  * Track FPS every second
  * Calculate average and minimum FPS
  * Fail if FPS < 58 (allowing 2 frame buffer)
- Memory leak detection:
  * Track heap size over 10 minutes
  * Verify memory stabilizes
  * No continuous growth pattern
- Load time testing:
  * Measure Time to Interactive (TTI)
  * Measure First Contentful Paint (FCP)
  * Verify metrics meet requirements
- Run performance tests in CI
- Generate performance reports

Deliverable: Performance test suite with benchmarks
```
