### Prompt 9.5: Mobile Touch Controls

```
Add mobile-specific touch controls (optional enhancement).

Requirements:
1. Create /src/app/core/services/touch-handler.service.ts with:
   - enableTouch(element): void - registers touch listeners
   - getTouchPosition(): {x, y} - returns touch coordinates
   - onTap(): Observable<void> - tap event stream
   - onSwipe(): Observable<SwipeDirection> - swipe detection
2. Mobile control scheme:
   - Touch left half of screen: move left
   - Touch right half of screen: move right
   - Tap to shoot
   - Swipe up for rapid fire
3. Visual touch indicators
4. Virtual D-pad option
5. Auto-detect mobile device

TDD Approach:
- Create touch-handler.service.spec.ts:
  * enableTouch registers touch event listeners
  * getTouchPosition returns correct coordinates
  * onTap emits when screen tapped
  * onSwipe detects swipe direction
  * Left side touch moves player left
  * Right side touch moves player right
  * Tap fires projectile
- Implement touch control system
- Test on actual mobile devices
- Ensure responsive and precise

Deliverable: Mobile touch control system
```
